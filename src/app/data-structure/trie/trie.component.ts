import { Component, OnInit, ɵɵstylePropInterpolate5 } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import * as Trie from '../ds-interfaces/trie-node';
import * as p5 from 'p5';
//TODO fix reset while inserting withoutput
//Search
//dropdown nav

const CANVAS_WIDTH  = .8 * window.innerWidth;
const CANVAS_HEIGHT = .7 * window.innerHeight;
const NODE_RADIUS = 40;

@Component({
  selector: 'app-trie',
  templateUrl: './trie.component.html',
  styleUrls: ['./trie.component.scss']
})
export class TrieComponent implements OnInit {
  private data       : string[]
  private p5sketch   : p5;
  private dataBusSub : Subscription;
  private root       : Trie.TrieNode = new Trie.TrieNode();
  private nodesPerRow: Map<number, number> = new Map<number, number>();

  word       : string  = "";
  searchWord : string  = "";
  inserting  : boolean = false;
  searching  : boolean = false;
  found      : boolean = false

  constructor(
    private dataBus : DsBusService
  ) {     

  }

  reinitializeComponent() {
    this.root = new Trie.TrieNode();
    this.root.value = "ROOT";
    this.root.x = CANVAS_WIDTH/2;
    this.root.y = NODE_RADIUS; 
    this.nodesPerRow = new Map<number,number>();
  }

  ngOnInit(): void {
    this.p5sketch = new p5(this.sketch);
    this.reinitializeComponent();
   
    this.dataBus.searchData.subscribe((searchWord) => {
      this.findWord(searchWord);
    })
   // when data changes, redraw all nodes, hide nodes on path of inserted word and animate them
    this.dataBusSub = this.dataBus.dataChange.subscribe((data) => {
      this.data = data;
      this.p5sketch.background(0);
      if(data === null) {
        this.reinitializeComponent();
      } else {
        const visitedNodes = this.insertIntoTrie(data);
        if(visitedNodes.length>0) 
          this.animateVisitedNodes(visitedNodes);
      }
      this.drawAllNodes();
    })
  }

  findWord(word: string) {
    if (word.length === 0) return;
    this.searching = true;
    this.searchWord = word;
    const visitedNodes = [];
    const [lastIdxMatched,lastNodeMatched] = Trie.searchTrie(this.root,word,visitedNodes);
    this.found = (lastIdxMatched == word.length-1 && lastNodeMatched.isEndOfWord == true); 
    if(visitedNodes.length>0) {
      this.animateVisitedNodes([visitedNodes]);
    }
    setTimeout( ()=> {
      this.searching = false;
    },(word.length+1)*500);
  }

  /**
   * sets up canvas to place drawings on
   * @param p 
   */
  sketch(p: any) {
    let canvas;
    p.setup = () => {
      canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      canvas.parent('trie-container');
      p.background(0);
    }
  }

  /**
   * Inserts words into trie
   * @param data 
   */
  insertIntoTrie(data: string[]) {
    this.inserting = true;
    let result: Trie.TrieNode[][] = [];
    for(const word of data) {
      result.push(Trie.insertWord(word.trim(),this.root,this.nodesPerRow));
    }
    return result;
  }

  /**
   * Traverses all data in the trie before a new insertion occurs and renders 
   * them without animation
   */
  drawAllNodes() : Trie.TrieNode[] {
    let result = [];
    this.drawNode(this.root);
    let queue:Trie.TrieNode[] = [this.root];
    
    let currentLevel = this.root.level;
    let i = 0;
    let nodesInchildRow = this.nodesPerRow.get(currentLevel+1);
    while(Boolean(queue.length)) {
      let currentNode = queue.shift();
      if(currentNode.level !== currentLevel) {
        currentLevel = currentNode.level;
        i = 0;
        nodesInchildRow = this.nodesPerRow.get(currentLevel+1);
      }
      result.push(currentNode);
      for(const node of currentNode.children.values()) {
        this.calculateNodeCoordinates(node,currentNode,nodesInchildRow,i);
        this.drawNode(node);
        this.connectNodes(currentNode,node);
        i++;
        queue.push(node);
      }
    }
    return result;
  }

  /**
   * Generates coordinates for argument "node" relative to its parent node 
   * @param node 
   * @param parentNode 
   * @param nodesInchildRow 
   * @param i amount of node radii to offset current node by
   */
  calculateNodeCoordinates(node: Trie.TrieNode, parentNode: Trie.TrieNode, nodesInchildRow: number,i: number) {
    node.y = parentNode.y+1.5*NODE_RADIUS;
    node.x = this.root.x-(Math.floor(nodesInchildRow)/2)*(NODE_RADIUS*2) + i*NODE_RADIUS*2; 
  }

  /**
   * hides new nodes then animates path to them
   * @param visitedNodes 
   */
  animateVisitedNodes(visitedNodesPaths: Trie.TrieNode[][]) {
    let previousDelay = 0;
    let wordIdx = 0;
    for (const visitedNodes of visitedNodesPaths) {
      let i;
      //hide new nodes 
      if(visitedNodes[0].newNode) 
        this.hideNode(visitedNodes[0],this.root);
      for (i=1;i<visitedNodes.length;i++) {
        if (visitedNodes[i].newNode)
          this.hideNode(visitedNodes[i],visitedNodes[i-1]);
      }

      setTimeout( () => {
        this.word = this.data[wordIdx];
        wordIdx++;
        this.animatePath(1,visitedNodes[0],this.root);
        for (i=1;i<visitedNodes.length;i++) {
          this.animatePath(i+1,visitedNodes[i],visitedNodes[i-1]);
        }
      },previousDelay);
      previousDelay = previousDelay + visitedNodes.length*500;
    } 
    setTimeout (()=> {
      this.word = "";
      this.inserting = false;
    },previousDelay);
  }

  /**
   * Draws empty ellipse at given node
   * @param node 
   */
  hideNode(node: Trie.TrieNode,parent: Trie.TrieNode) {
    this.p5sketch.fill(0);
    this.p5sketch.stroke(0);
    this.p5sketch.ellipse(node.x,node.y,NODE_RADIUS,NODE_RADIUS);
    this.connectNodes(parent,node);
    this.p5sketch.stroke(255);
  }

  /**
   * draws line from current node to node, sets the current node color to red and back to black
   * @param i , animation delay offset determine by order of visit
   * @param currentNode 
   * @param parentNode 
   */
  animatePath(i,currentNode,parentNode) {
    setTimeout( ()=> {
      this.drawNode(currentNode);
      this.connectNodes(parentNode,currentNode);
      if(!currentNode.newNode) {
        this.p5sketch.fill('green');
      } else {
        this.p5sketch.fill('red');
        currentNode.newNode = false;
      }
      this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
    },i*300);

    setTimeout(() => {
      this.p5sketch.fill('black');
      this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
      this.drawNode(currentNode);
    }, i*500);
  }

  connectNodes(parentNode:Trie.TrieNode,node:Trie.TrieNode,i=0) {
    setTimeout( ()=> {
      this.p5sketch.line(parentNode.x,parentNode.y+NODE_RADIUS/2,node.x,node.y-NODE_RADIUS/2);
    },i*300);
  }

  drawNode(currentNode: Trie.TrieNode) {
    this.p5sketch.textAlign(p5.prototype.CENTER);
    this.p5sketch.fill(255);
    this.p5sketch.textSize(16);
    this.p5sketch.text(currentNode.value,currentNode.x,currentNode.y);
    this.p5sketch.stroke(255);
    this.p5sketch.noFill();
    this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
  }

  ngOnDestroy() {
    this.dataBusSub.unsubscribe();
  }
}


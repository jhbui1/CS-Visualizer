import { Component, OnInit, ɵɵstylePropInterpolate5 } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import * as Trie from '../ds-interfaces/trie-node';
import * as NodeAnim from '../ds-interfaces/p5-nodes-anims';

@Component({
  selector: 'app-trie',
  templateUrl: './trie.component.html',
  styleUrls: ['./trie.component.scss']
})
export class TrieComponent implements OnInit {
  private data       : string[]
  private p5sketch   : NodeAnim.NodeAnim;
  private dataBusSub : Subscription;
  private searchSub  : Subscription; 
  private root       : Trie.TrieNode = new Trie.TrieNode();
  private nodesPerRow: Map<number, number> = new Map<number, number>();

  word      : string  = "";
  searchWord: string  = "";
  inserting : boolean = false;
  searching : boolean = false;
  found     : boolean = false

  constructor(
    private dataBus : DsBusService
  ) {     

  }

  reinitializeComponent() {
    this.root = new Trie.TrieNode();
    this.root.value = "ROOT";
    this.root.x = NodeAnim.CANVAS_WIDTH/2;
    this.root.y = NodeAnim.NODE_RADIUS; 
    this.nodesPerRow = new Map<number,number>();
  }

  ngOnInit(): void {
    this.p5sketch = new NodeAnim.NodeAnim();
    this.reinitializeComponent();
   
    this.searchSub = this.dataBus.searchData.subscribe((searchWord) => {
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
    this.p5sketch.drawNode(this.root);
    let queue:Trie.TrieNode[] = [this.root];
    
    let currentLevel = this.root.level;
    let i = 0; //child nodes position in row
    let nodesInchildRow = this.nodesPerRow.get(currentLevel+1);
    while(Boolean(queue.length)) {
      let currentNode = queue.shift();
      //reset row offset when new row is reached
      if(currentNode.level !== currentLevel) {
        currentLevel = currentNode.level;
        i = 0;
        nodesInchildRow = this.nodesPerRow.get(currentLevel+1);
      }

      result.push(currentNode);

      //draw nodes
      for(const node of currentNode.children.values()) {
        this.calculateNodeCoordinates(node,currentNode,nodesInchildRow,i);
        this.p5sketch.handleNodeDraw(node,currentNode);
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
 calculateNodeCoordinates(
    node           : Trie.TrieNode,
    parentNode     : Trie.TrieNode,
    nodesInchildRow: number,
    i              : number) {
    node.y = parentNode.y+1.5*NodeAnim.NODE_RADIUS;
    node.x = this.root.x-(Math.floor(nodesInchildRow)/2) *
      (NodeAnim.NODE_RADIUS*2) + i*NodeAnim.NODE_RADIUS*2; 
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
        this.p5sketch.hideNode(visitedNodes[0],this.root);
      for (i=1;i<visitedNodes.length;i++) {
        if (visitedNodes[i].newNode)
          this.p5sketch.hideNode(visitedNodes[i],visitedNodes[i-1]);
      }

      //animate nodes part of inserted/search word
      setTimeout( () => {
        this.word = this.data[wordIdx];
        wordIdx++;
        this.p5sketch.animatePath(1,visitedNodes[0],this.root);
        for (i=1;i<visitedNodes.length;i++) {
          this.p5sketch.animatePath(i+1,visitedNodes[i],visitedNodes[i-1]);
        }
      },previousDelay);
      previousDelay = previousDelay + visitedNodes.length*500;
    } 
    //reset word in status bar
    setTimeout (()=> {
      this.word = "";
      this.inserting = false;
    },previousDelay);
  }

  ngOnDestroy() {
    this.dataBusSub.unsubscribe();
    this.searchSub.unsubscribe();
  }
}


import { Component, OnInit, ɵɵstylePropInterpolate5 } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import * as Trie from '../ds-interfaces/trie-node';
import * as p5 from 'p5';

// declare var p5: any;

const CANVAS_WIDTH  = 500;
const CANVAS_HEIGHT = 700;
const NODE_RADIUS = 40;

@Component({
  selector: 'app-trie',
  templateUrl: './trie.component.html',
  styleUrls: ['./trie.component.scss']
})
export class TrieComponent implements OnInit {
  data      : string[];
  dataBusSub: Subscription;
  root      : Trie.TrieNode = new Trie.TrieNode();
  allNodes  : Trie.TrieNode[] = [];

  private p5sketch;
  nodesPerRow : Map<number,number> = new Map<number,number>();

  constructor(
    private dataBus : DsBusService
  ) { }

  ngOnInit(): void {
    this.p5sketch = new p5(this.sketch);
    this.dataBusSub = this.dataBus.dataChange.subscribe((value) => {
      this.data=value;
      this.renderValues();
      this.allNodes = this.getAllNodes();
    })
  }

  sketch(p: any) {
    let canvas;
    p.setup = () => {
      canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      canvas.parent('trie-container');
      p.background(0);
    }
  }


  renderValues() {
    for(const word of this.data) {
      Trie.insertWord(word,this.root,this.nodesPerRow);
    }
    let height = Math.max(...(this.data.map(el => el.length)));
    this.initializeGrid(height+1,this.data.length);
  }

  /**
   * creates css grid with given height and width
   * @param height 
   * @param width is the amount of strings in this.data, s
   */
  initializeGrid(height: number, width: number) {
  }

  populateGrid() {

  }

  getAllNodes() : Trie.TrieNode[] {
    let result = [];
    this.root.x = CANVAS_WIDTH/2;
    this.root.y = 16;
    this.root.value="ROOT";
    let queue:Trie.TrieNode[] = [this.root];
    
    //keeps track of placed nodes perlevel
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
      this.p5sketch.textAlign(p5.prototype.CENTER);
      this.p5sketch.fill(255);
      this.p5sketch.textSize(16);
      this.p5sketch.text(currentNode.value,currentNode.x,currentNode.y);
      this.p5sketch.stroke(255);
      this.p5sketch.noFill();
      this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
      result.push(currentNode);
      for(const node of currentNode.children.values()) {
        node.y = currentNode.y+1.5*NODE_RADIUS;
        node.x = this.root.x-(Math.floor(nodesInchildRow)/2*NODE_RADIUS*2) + i*NODE_RADIUS*2; 
        this.p5sketch.line(currentNode.x,currentNode.y+NODE_RADIUS/2,node.x,node.y-NODE_RADIUS/2);
        i++;
        queue.push(node);
      }
    }
    return result;
  }

 

  ngOnDestroy() {
    this.dataBusSub.unsubscribe();
  }
}


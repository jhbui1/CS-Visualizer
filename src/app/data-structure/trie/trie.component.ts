import { Component, OnInit, ɵɵstylePropInterpolate5 } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import * as Trie from '../ds-interfaces/trie-node';

declare var p5: any;

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
      debugger;
    })
  }

  sketch(p: any) {
    let canvas;
    p.setup = () => {
      canvas = p.createCanvas(595, 700);
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
    let queue:Trie.TrieNode[] = [this.root];
    while(Boolean(queue.length)) {
      let currentNode = queue.shift();
      result.push(currentNode);
      for(const node of currentNode.children.values()) {
        queue.push(node);
      }
    }
    return result;
  }

  ngOnDestroy() {
    this.dataBusSub.unsubscribe();
  }
}


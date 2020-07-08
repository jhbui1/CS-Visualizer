import { Component, OnInit } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import * as Trie from '../ds-interfaces/trie-node';

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

  nodesPerRow : Map<number,number> = new Map<number,number>();

  constructor(
    private dataBus : DsBusService
  ) { }

  ngOnInit(): void {
    this.dataBusSub = this.dataBus.dataChange.subscribe((value) => {
      this.data=value;
      this.renderValues();
      this.allNodes = this.getAllNodes();
      debugger;
    })
  }

  renderValues() {
    for(const word of this.data) {
      Trie.insertWord(word,this.root,this.nodesPerRow);
    }
    let height = Math.max(...(this.data.map(el => el.length)));
    this.initializeGrid(height+1,this.data.length);
    // for (let i=0;i<=height;i++) {
    //   const row = document.getElementsByClassName(`level-${i}`) as HTMLCollection;
    //   for (const node of row) {
        
    //   }
    // }
  }

  /**
   * creates css grid with given height and width
   * @param height 
   * @param width is the amount of strings in this.data, s
   */
  initializeGrid(height: number, width: number) {
    const container = document.getElementById('trie-container');

    if(width%2==0) //ensure odd width for centering 
      width+=1; 

    container.style.setProperty('--grid-rows',String(height));
    container.style.setProperty('--grid-cols',String(width))
    
    for (let row=0;row<height;row++) {
      for (let col=0;col<width;col++) {
        let cell = document.createElement("div");
        cell.id = `row-${row}-col-${col}`;
        // cell.innerText = `${row}-${col}`
        cell.classList.add("trie-node");
        container.appendChild(cell);
      }
    }
    this.populateGrid();

  }

  populateGrid() {
    let stack = [this.root];
    let i = 0,current_level=1;
    let start = Math.floor((this.data.length-this.nodesPerRow.get(current_level))/2);

    while(Boolean(stack.length)) {
      const current = stack.shift();
      if(current.level>0 ) {
        if (current.level != current_level) {
          current_level = current.level;
          i=0;
          start = (this.data.length-this.nodesPerRow.get(current_level))/2;
        }
        debugger;
        const cell = document.getElementById(`row-${current.level}-col-${start+i}`)
        cell.innerText = current.value;
        cell.classList.add('active');
        i++;

      }
      for (const [_,value] of current.children.entries()) {
        stack.push(value);
      }
    }
    //add children from center - children.length/2 TO center + children.length/2
      //reserve child x's children length in next array,
      //*offset by length-nodes in level/2
     

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


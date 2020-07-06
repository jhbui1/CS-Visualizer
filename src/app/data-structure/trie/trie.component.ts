import { Component, OnInit } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import { TrieNode } from '../ds-interfaces/trie-node';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Component({
  selector: 'app-trie',
  templateUrl: './trie.component.html',
  styleUrls: ['./trie.component.scss']
})
export class TrieComponent implements OnInit {
  data      : string[];
  dataBusSub: Subscription;
  root      : TrieNode = new TrieNode();
  allNodes  : TrieNode[] = [];

  constructor(
    private dataBus : DsBusService
  ) { }

  ngOnInit(): void {
    this.dataBusSub = this.dataBus.dataChange.subscribe((value) => {
      this.data=value;
      this.renderValues();
      this.allNodes = this.getAllNodes();
      console.log(this.allNodes);
      debugger;
    })
  }

  renderValues() {
    for(const word of this.data) {
      this.insertWord(word);
    }
  }

  insertWord(word: string) {
    const [lastIndexMatched,lastMatchingNode] = searchTrie(this.root,word);
    if(lastIndexMatched===word.length-1) { //check if word already exists, preemptively set EOW
      lastMatchingNode.isEndOfWord = true;
      return;
    } else {
      let currentNode = lastMatchingNode;
      debugger;
      for(let i=lastIndexMatched+1;i<word.length;i++) {
        let newTrieNode = this.createTrieNode(word[i],currentNode);
        currentNode.children.set(newTrieNode.value,newTrieNode);
        currentNode = newTrieNode;
      }
      currentNode.isEndOfWord = true;
    }
  }

  createTrieNode(value:string,parent:TrieNode,):TrieNode {
    return new TrieNode (
      value,
      parent
    )
  }

  getAllNodes() : TrieNode[] {
    let result = [];
    let queue:TrieNode[] = [this.root];
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

/**
 * Searches trie for given word, returns last node matched and
 * index of last character matched in the word
 * @param root 
 * @param word 
 */
function searchTrie(root:TrieNode, word:string): [number,TrieNode]{
  let currentNode: TrieNode = root;
  let i = 0;
  for(;i<word.length;i++) {
    if(currentNode.children.has(word[i])) {
      currentNode =  currentNode.children.get(word[i]);
    } else {
      i--;
      break;
    }
    if(i==word.length-1) break;
  }
  return [i,currentNode];
} 

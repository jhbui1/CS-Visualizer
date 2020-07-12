import { TreeNode } from './tree-node';

export class TrieNode extends TreeNode {
    constructor( 
        value      : string     = "",
        parent     : TreeNode   = null,
        public children   : Map<string, TrieNode> = new Map<string, TrieNode>(),
        public isEndOfWord: boolean    = false,
        level      : number     = 0,
        x          : number     = 0,
        y          : number     = 0,
        newNode    : boolean    = true
    ) {
      super({
        value  : value,
        parent : parent,
        x      : x,
        y      : y,
        level  : level,
        newNode: newNode
      });
    }
}

/**
 * Inserts a given word, returning an updated nodes per row map and the nodes visited
 * @param word 
 * @param root 
 * @param nodesPerRow record of nodes per row to be updated
 */
export function insertWord(word: string, root:TrieNode, nodesPerRow:Map<number,number>): TrieNode[] {
  let result = [];
  const [lastIndexMatched,lastMatchingNode] = searchTrie(root,word,result);
  if(lastIndexMatched===word.length-1) { //check if word already exists, preemptively set EOW
    lastMatchingNode.isEndOfWord = true;
    return result;
  } else {
    let currentNode = lastMatchingNode;
    for(let i=lastIndexMatched+1;i<word.length;i++) {
      let newTrieNode:TrieNode = new TrieNode (
          word[i],
          currentNode,
          new Map<string,TrieNode>(),
          false,
          currentNode.level+1
      )
      let level = newTrieNode.level;
      nodesPerRow.set(level,(nodesPerRow.get(level) || 0) + 1);
      currentNode.children.set(newTrieNode.value,newTrieNode);
      currentNode = newTrieNode;
      result.push(newTrieNode);
    }
    currentNode.isEndOfWord = true;
  }
  return result;
}

/**
 * Searches trie for given word, returns last node matched and
 * index of last character matched in the word
 * @param root 
 * @param word 
 * @param nodesVisited nodes from beginning of word to end which match letters of target word
 */
export function searchTrie(root:TrieNode, word:string, nodesVisited: TrieNode[] = []): [number,TrieNode]{
    let currentNode: TrieNode = root;
    let i = 0;
    for(;i<word.length;i++) {
      if(currentNode.children.has(word[i])) {
        currentNode =  currentNode.children.get(word[i]);
        nodesVisited.push(currentNode);
      } else {
        i--;
        break;
      }
      if(i==word.length-1) break;
    }
    return [i,currentNode];
  } 
  
export class TrieNode  {
    constructor( 
        public value      : string     = "",
        public parent     : TrieNode   = null,
        public children   : Map<string, TrieNode> = new Map<string, TrieNode>(),
        public isEndOfWord: boolean    = false,
        public level      : number     = 0
    ) {}
}

export function insertWord(word: string, root:TrieNode, nodesPerRow:Map<number,number>) {
    const [lastIndexMatched,lastMatchingNode] = searchTrie(root,word);
    if(lastIndexMatched===word.length-1) { //check if word already exists, preemptively set EOW
      lastMatchingNode.isEndOfWord = true;
      return;
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
      }
      currentNode.isEndOfWord = true;
    }
  }

/**
 * Searches trie for given word, returns last node matched and
 * index of last character matched in the word
 * @param root 
 * @param word 
 */
export function searchTrie(root:TrieNode, word:string): [number,TrieNode]{
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
  
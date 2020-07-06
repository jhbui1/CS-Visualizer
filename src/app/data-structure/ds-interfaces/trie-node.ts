export class TrieNode  {
    constructor( 
        public value      : string = "",
        public parent     : TrieNode = null,
        public children   : Map<string,TrieNode> = new Map<string,TrieNode>(),
        public isEndOfWord: boolean = false
    ) {}
}
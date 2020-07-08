export class TreeNode {
    constructor (
        public value : string,
        public parent : TreeNode,
        public children : TreeNode[],
        public level: number
    ) {}
}
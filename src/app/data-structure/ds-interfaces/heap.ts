import { TreeNode } from '../ds-interfaces/tree-node';
import { insertWord } from './trie-node';

export class Heap {
    nodes: TreeNode[] = [];
    constructor(
    ) {}


    nodeIsRoot(node: TreeNode) : boolean {
        return node.level == 0;
    }

    /**
     * returns parent's index
     * @param node 
     */
    calculateParentIdx(node: TreeNode): number {
        const idx = this.nodes.indexOf(node);
        return Math.floor((idx-1) / 2);
    }

    getParentNode(node : TreeNode): TreeNode {
        if (this.nodeIsRoot(node)) return null;
        return this.nodes[this.calculateParentIdx(node)];
    }

    /**
     * Inserts value and returns visited nodes in order
     * @param value 
     */
    insert(value: number) : TreeNode[] {
        const visitedNodes: TreeNode[] = []; 
        let node = new TreeNode({
            value  : String(value),
            newNode: false,
            level  : Math.floor(Math.log2(this.nodes.length+1))
        });
        this.nodes.push(node);
        let nodeIdx = this.nodes.indexOf(node);
        let parentIdx = Math.floor((nodeIdx - 1) / 2);

        //bubble up new node until it is no longer greater than its parent
        while (parentIdx >= 0) {
            if( Number(this.nodes[parentIdx].value) < Number(node.value)) {
                this.nodes[parentIdx].level = node.level;
                node.level--;

                visitedNodes.push(this.nodes[parentIdx]);

                [this.nodes[parentIdx],this.nodes[nodeIdx]] = [this.nodes[nodeIdx],this.nodes[parentIdx]];
            }
            nodeIdx = parentIdx;
            parentIdx = Math.floor((nodeIdx - 1) / 2);
        }

        //push new node once it reachesits final position in heap array, so that all left neighbor contain the original value
        visitedNodes.push(node);

        return visitedNodes;
    }


}
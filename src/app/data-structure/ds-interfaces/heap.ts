import { TreeNode } from '../ds-interfaces/tree-node';

export class Heap {
    isMaxHeap: boolean = true;

    private nodes: TreeNode[] = [];

    constructor(
    ) {}

    /////////////////////////////////
    // Accessors & helpers
    /////////////////////////////////

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

    getRoot() : TreeNode{
        return this.nodes.length > 0 ? this.nodes[0] : null;
    }

    getParentNode(node : TreeNode): TreeNode {
        if (this.nodeIsRoot(node)) return null;
        return this.nodes[this.calculateParentIdx(node)];
    }

    getNodeAtIndex(index: number): TreeNode {
        return (0 <= index && index < this.nodes.length) ? this.nodes[index] : null;
    }

    getHeapSize(): number {
        return this.nodes.length;
    }
    /////////////////////////////////
    //Functionality
    /////////////////////////////////

    /**
     * Compares two nodes at given indices checking if left is greater than right if max heap,
     * or if left is less than right if min heap
     * @param leftIdx 
     * @param rightIdx 
     */
    compareNodes(leftIdx:number, rightIdx:number): boolean {
        if((this.isMaxHeap && Number(this.nodes[leftIdx].value) >  Number(this.nodes[rightIdx].value)) || 
        (!this.isMaxHeap && Number(this.nodes[rightIdx].value) <  Number(this.nodes[rightIdx].value))
        ){
            return true;
        }
        return false;
    }

    /**
     * swaps two nodes and updates level according to direction
     * @param currentIdx index of the bubbling node
     * @param targetIdx index of the bubblin nodes parenbt/child
     * @param direction false to move the bubbling node down
     */
    swapNodes(currentIdx: number, targetIdx: number, direction:boolean) {
        const node = this.nodes[currentIdx];
        const targetNode = this.nodes[targetIdx];
        node.level = targetNode.level;
        if (direction) { //bubbling up
            targetNode.level++;
        } else {
            targetNode.level--;
        }

        [this.nodes[currentIdx],this.nodes[targetIdx]] = [this.nodes[targetIdx],this.nodes[currentIdx]];
    }

    reset() {
        this.nodes = [];
    }

    pop() : TreeNode[] {
        const visitedNodes = [];
        //Replace root with last element
        this.nodes[0] = this.nodes[this.nodes.length-1];
        const bubbleNode = this.nodes[0];
        this.nodes.pop();

        //bubble last element (new root) down
        let currentIdx = 0;
        let leftChildIdx = 1;
        let rightChildIdx = 2;
        while (leftChildIdx < this.nodes.length) { 
            //check if current node does not satisfy heap condition in relation to left child
            if (!this.compareNodes(currentIdx,leftChildIdx)) { 
                //if right child is larger (max-heap) or less (min-heap) than left, it should be pushed up
                if (rightChildIdx < this.nodes.length && this.compareNodes(rightChildIdx,leftChildIdx)) {
                    visitedNodes.push(this.nodes[rightChildIdx]);
                    this.swapNodes(currentIdx,rightChildIdx,false);
                } else {
                    visitedNodes.push(this.nodes[leftChildIdx]);
                    this.swapNodes(currentIdx,leftChildIdx,false);
                }
            } else if (rightChildIdx < this.nodes.length && !this.compareNodes(currentIdx,rightChildIdx)) { //compare right node
                visitedNodes.push(this.nodes[rightChildIdx]);
                this.swapNodes(currentIdx,rightChildIdx,false);
            } else {
                break;
            }
            currentIdx = leftChildIdx;
            leftChildIdx = (currentIdx * 2) + 1;
            rightChildIdx = leftChildIdx + 1;
        }
        visitedNodes.push(bubbleNode);
        return visitedNodes;
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
            if(this.compareNodes(nodeIdx,parentIdx)) {
                visitedNodes.push(this.nodes[parentIdx]);
                this.swapNodes(nodeIdx,parentIdx,true);
            } else {
                break;
            }
            nodeIdx = parentIdx;
            parentIdx = Math.floor((nodeIdx - 1) / 2);
        }

        //push new node once it reachesits final position in heap array, so that all left neighbor contain the original value
        visitedNodes.push(node);
        return visitedNodes;
    }


}
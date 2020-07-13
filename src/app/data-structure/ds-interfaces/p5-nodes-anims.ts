import { TreeNode } from './tree-node';
import * as p5 from 'p5';


export const CANVAS_WIDTH  = .8 * window.innerWidth;
export const CANVAS_HEIGHT = .7 * window.innerHeight;
export const NODE_RADIUS = 40;


export class NodeAnim {
    p5sketch: any;
    constructor () {
        this.p5sketch = new p5(this.sketch); 
    }

    /**
     * sets sketch background according to 1 or 3 color values
     * @param n1 
     * @param n2 
     * @param n3 
     */
    background(n1: number, n2: number = -1, n3:number = -1) {
        if(n2 > 0 && n3 > 0) {
            this.p5sketch.background(n1,n2,n3);
        } else {
            this.p5sketch.background(n1);
        }
    }

    /**
    * sets up canvas to place drawings on
    * @param p 
    */
    sketch(p: any) {
        let canvas;
        p.setup = () => {
        canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.parent('p5-content');
        p.background(0);
        }
    }
   
   /**
    * Calls methods to calculate coordinates for given node, 
    * draw it and connect it to its parent
    * @param node 
    * @param parentNode 
    * @param nodesInchildRow 
    * @param i 
    */
    handleNodeDraw(
       node           : TreeNode,
       parentNode     : TreeNode,
   ) {
        this.drawNode(node);
        this.connectNodes(parentNode,node);
   }
   
    /**
     * Draws empty ellipse at given node
     * @param node 
     */
    hideNode(
        node  : TreeNode,
        parent: TreeNode = null
    ) {

        this.p5sketch.fill(0);
        this.p5sketch.stroke(0);
        this.p5sketch.ellipse(node.x,node.y,NODE_RADIUS,NODE_RADIUS);
        if (parent !== null)
            this.connectNodes(parent,node);
        this.p5sketch.stroke(255);
    }

    /**
     * draws node at current node position and optionally places given value there 
     * @param currentNode 
     * @param value 
     */
    drawNode(currentNode: TreeNode, value: string = null) {
        this.p5sketch.textAlign(p5.prototype.CENTER);
        this.p5sketch.fill(255);
        this.p5sketch.textSize(16);
        if (value === null) {
            this.p5sketch.text(currentNode.value,currentNode.x,currentNode.y);
        }
        else {
            this.hideNode(currentNode);
            this.p5sketch.fill(255);
            this.p5sketch.text(value,currentNode.x,currentNode.y);
        }
        this.p5sketch.stroke(255);
        this.p5sketch.noFill();
        this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
    }
   
    /**
     * draws line between bottom of parent node and top of node
     * @param parentNode 
     * @param node 
     * @param i animation delay offset
     */
    connectNodes(
        parentNode: TreeNode,
        node      : TreeNode,
        i=0) {
        setTimeout( ()=> {
          this.p5sketch.line(parentNode.x,parentNode.y+NODE_RADIUS/2,node.x,node.y-NODE_RADIUS/2);
        },i*300);
    }

    /**
     * draws line from current node to node, sets the current node color to red and back to black
     * @param i , animation delay offset determine by order of visit
     * @param currentNode 
     * @param parentNode 
     */
    animatePath(
        i          : number,
        currentNode: TreeNode,
        parentNode : TreeNode,
        multiplier : number = 1
    ) {
        //
        setTimeout( ()=> {
            this.drawNode(currentNode);
            if (parentNode != null)
                this.connectNodes(parentNode,currentNode);
            if(!currentNode.newNode) {
                this.p5sketch.fill('green');
            } else {
                this.p5sketch.fill('red');
                currentNode.newNode = false;
            }
            this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
        },(100+(i*700))*multiplier);

        setTimeout(() => {
            this.p5sketch.fill('black');
            this.p5sketch.ellipse(currentNode.x,currentNode.y,NODE_RADIUS,NODE_RADIUS);
            this.drawNode(currentNode);
        },(700+(i*700))*multiplier);
    }
}


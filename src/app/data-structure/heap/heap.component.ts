import { Component, OnInit, Input } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import { NodeAnim, CANVAS_WIDTH, CANVAS_HEIGHT, NODE_RADIUS } from '../ds-interfaces/p5-nodes-anims';
import { Heap } from '../ds-interfaces/heap';
import { TreeNode } from '../ds-interfaces/tree-node';

//TODO handle duplicates
//choose appropiate value if both children compare

@Component({
  selector: 'app-heap',
  templateUrl: './heap.component.html',
  styleUrls: ['./heap.component.scss']
})
export class HeapComponent implements OnInit {
  @Input() multiplier: number; 

  dataBusSub: Subscription;
  p5sketch  : NodeAnim;
  heap      : Heap;

  constructor(
    private dataBus: DsBusService
  ) { }

  ngOnInit(): void {
    this.p5sketch = new NodeAnim();
    this.heap = new Heap();
    this.dataBusSub = this.dataBus.dataChange.subscribe( (data) => {
      if (data != null) {
        this.processHeapData(data);
      } else {
        this.reset();
      }
    });
  }

  popMax() {
    const alertString = this.heap.isMaxHeap ? "Max value is " : "Min value is ";
    const originalRootVal = this.heap.getRoot().value;
    alert(alertString+originalRootVal);
    const path = this.heap.pop();
    this.drawAllNodes();
    debugger;
    this.animatePath(path,Number(originalRootVal)); 
  }

  reset() {
    this.heap.reset();
    this.drawAllNodes();
  }

  /**
   * inserts values into heap returning paths used to insert the values
   * @param data 
   */
  processHeapData(data: string[]) {
    const stoi = data.filter(x=> (Number(x)|| Number(x)===0) && x!=="").map(x=>+x); 
    if (stoi.length == 0) {
      alert("Please enter a number");
    } else if (stoi.length != data.length) { //check if input all succesffuly covnerted to nums
      alert("Please only enter numbers");
    } else {
      this.insertData(stoi);
    }
  }

  insertData(stoi: number[]) {
    let previousDelay = 0;
    let i = 0;
    let path: TreeNode[];
    for (const num of stoi) {
      setTimeout(() => {
        //draw previous tree
        path = this.heap.insert(num);
        this.drawAllNodes();
        this.animatePath(path,num);
      },previousDelay );
      i++;
      //assume on each insertion num is bubbled to top
      previousDelay = (Math.ceil(Math.floor(i)) * 800 * this.multiplier) + previousDelay;
    }
  }

  /**
   * 
   * @param visitedNodePath path inserted node takes by swapping with parent if it is greater than it
   * @param insertedValue inserted value
   */
  animatePath(visitedNodePath: TreeNode[],insertedValue:number = -1) {
    let i;
    const lastIdx = visitedNodePath.length - 1;
    for(i=0;i<visitedNodePath.length;i++) {
      //swap parents value with current value
      const oldValue = i == 0 ? String(insertedValue) : visitedNodePath[i-1].value;
      this.p5sketch.drawNode(visitedNodePath[i],oldValue);

      //go up to parent, flash green if swapped, red if not
      const parent = this.heap.getParentNode(visitedNodePath[i]);
      if ( Boolean(parent) ) {
        if (i == lastIdx) parent.newNode = true;
        this.p5sketch.animatePath(i+1,parent,null,this.multiplier);
      }

      //update start node after animating its parent
      if (i == 0) {
        setTimeout ( () => { 
          this.p5sketch.drawNode(visitedNodePath[0],visitedNodePath[0].value);
        }, 800 * this.multiplier);
      }
      //if last visited node is not root, make its parent red to indicate path terminus

    }
  }

  nodeIsRoot(node: TreeNode) : boolean {
    return node.level == 0;
  }

  drawAllNodes() {
    this.p5sketch.background(0);
    for (let i=0;i<this.heap.getHeapSize();i++) {
      const parentIdx = Math.floor((i-1)/2);
      this.calculateCoordinates(this.heap.getNodeAtIndex(i),i,parentIdx);
      if (i>0) {  
        this.p5sketch.handleNodeDraw(this.heap.getNodeAtIndex(i),this.heap.getNodeAtIndex(parentIdx));
      } else { //root shouldnt draw parent
        this.p5sketch.drawNode(this.heap.getNodeAtIndex(i));
      }
    }
  }

  /**
   * 
   * @param node 
   * @param currentIdx 
   * @param parentIdx 
   */
  calculateCoordinates(node: TreeNode, currentIdx:number, parentIdx:number) {
    
    if (currentIdx <= 0) {//node is root
      node.x = CANVAS_WIDTH/2;
      node.y = NODE_RADIUS;
    } else {
      node.y = this.heap.getNodeAtIndex(parentIdx).y + 1.5 * NODE_RADIUS;

      const height = Math.ceil(Math.log2(this.heap.getHeapSize()));
      const bottomRowWidth = Math.pow(2,height-1);
      const parentX = this.heap.getNodeAtIndex(parentIdx).x;
      if(currentIdx % 2 == 0) {//right child
        node.x = parentX + ((bottomRowWidth/Math.pow(2,node.level)) *  NODE_RADIUS);
      } else {
        node.x = parentX - ((bottomRowWidth/Math.pow(2,node.level))  * NODE_RADIUS);
      }
     
    }
  }
}

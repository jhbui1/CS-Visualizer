import { Component, OnInit, Input } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import { NodeAnim, CANVAS_WIDTH, CANVAS_HEIGHT, NODE_RADIUS } from '../ds-interfaces/p5-nodes-anims';
import { Heap } from '../ds-interfaces/heap';
import { TreeNode } from '../ds-interfaces/tree-node';
import { StmtModifier } from '@angular/compiler';

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

  reset() {
    this.heap.nodes = [];
    this.drawAllNodes();
  }

  /**
   * inserts values into heap returning paths used to insert the values
   * @param data 
   */
  processHeapData(data: string[]) {
    const stoi = data.filter(x=> (Number(x)|| Number(x)===0) && x!=="").map(x=>+x); 
    if (stoi.length == 0) {
      alert("Please only enter numbers");
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
      previousDelay = Math.ceil(Math.floor(i)) * 1000 * this.multiplier + previousDelay;
    }
  }

  /**
   * 
   * @param visitedNodePath path inserted node takes by swapping with parent if it is greater than it
   * @param num 
   */
  animatePath(visitedNodePath: TreeNode[],num:number) {
    let i;
    const lastIdx = visitedNodePath.length - 1;
    for(i=0;i<visitedNodePath.length;i++) {
      //swap parents value with current value
      const oldValue = i == 0 ? String(num) : visitedNodePath[i-1].value;
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
    for (let i=0;i<this.heap.nodes.length;i++) {
      const parentIdx = Math.floor((i-1)/2);
      this.calculateCoordinates(this.heap.nodes[i],i,parentIdx);
      if (i>0) {
        this.p5sketch.handleNodeDraw(this.heap.nodes[i],this.heap.nodes[parentIdx]);
      } else {
        this.p5sketch.drawNode(this.heap.nodes[i]);
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
      node.y = this.heap.nodes[parentIdx].y + 1.5 * NODE_RADIUS;

      const height = Math.ceil(Math.log2(this.heap.nodes.length));
      const bottomRowWidth = Math.pow(2,height-1);
      const parentX = this.heap.nodes[parentIdx].x;
      if(currentIdx % 2 == 0) {//right child
        node.x = parentX + ((bottomRowWidth/Math.pow(2,node.level)) *  NODE_RADIUS);
      } else {
        node.x = parentX - ((bottomRowWidth/Math.pow(2,node.level))  * NODE_RADIUS);
      }
     
    }
  }
}

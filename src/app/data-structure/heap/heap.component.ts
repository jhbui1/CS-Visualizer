import { Component, OnInit } from '@angular/core';
import { DsBusService } from '../ds-bus.service';
import { Subscription } from 'rxjs';
import { NodeAnim, CANVAS_WIDTH, CANVAS_HEIGHT, NODE_RADIUS } from '../ds-interfaces/p5-nodes-anims';
import { Heap } from '../ds-interfaces/heap';
import { TreeNode } from '../ds-interfaces/tree-node';
import { pathToFileURL } from 'url';

@Component({
  selector: 'app-heap',
  templateUrl: './heap.component.html',
  styleUrls: ['./heap.component.scss']
})
export class HeapComponent implements OnInit {
  dataBusSub: Subscription;
  p5sketch: NodeAnim;
  heap: Heap;

  constructor(
    private dataBus: DsBusService
  ) { }

  ngOnInit(): void {
    this.p5sketch = new NodeAnim();
    this.heap = new Heap();
    this.dataBusSub = this.dataBus.dataChange.subscribe( (data) => {
      this.processHeapData(data);
    });
  }


  /**
   * inserts values into heap returning paths used to insert the values
   * @param data 
   */
  processHeapData(data: string[]) : TreeNode[][] {
    const stoi = data.filter(x=> (Number(x)|| Number(x)===0) && x!=="").map(x=>+x); 
    if (stoi.length != data.length) { //check if input all succesffuly covnerted to nums
      alert("Please only enter numbers");
      return;
    } else {
      let previousDelay = 0;
      let path: TreeNode[];
      for (const num of stoi) {
        setTimeout(() => {
          //draw previous tree
          path = this.heap.insert(num);
          this.drawAllNodes();
          previousDelay = (path.length * 500) + previousDelay;
          this.animatePath(path,num);
        }, previousDelay);

      }
    }
  }

  animatePath(visitedNodePath: TreeNode[],num:number) {
    let currentIdx = this.heap.nodes.length-1;
    let parentIdx = Math.floor((currentIdx-1)/2);
    //draw first node containing insereted value
    this.p5sketch.drawNode(visitedNodePath[0],"");
    this.p5sketch.drawNode(visitedNodePath[0],String(num));

    for(let i=1;i<visitedNodePath.length;i++) {
      //swap parents value with current value
      this.p5sketch.drawNode(visitedNodePath[i],visitedNodePath[i-1].value);

      //go up to parent, make green if swap, red if not
      this.p5sketch.animatePath(i,visitedNodePath[i],visitedNodePath[i+1])
      
    }
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

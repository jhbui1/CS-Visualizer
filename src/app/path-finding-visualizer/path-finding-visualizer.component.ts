import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Node } from '../../app-interfaces/node';
import { dijkstra } from 'src/algorithms/dijkstra';
import { a_star } from 'src/algorithms/a_star';
import { bfs } from 'src/algorithms/bfs';
import { dfs } from 'src/algorithms/dfs';

import { getNodesInShortestPathOrder } from 'src/algorithms/ph_helpers';

const START_NODE_ROW  = 10;
const START_NODE_COL  = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const NUM_COLS = 50;
const NUM_ROWS = 20;

@Component({
  selector: 'app-path-finding-visualizer',
  templateUrl: './path-finding-visualizer.component.html',
  styleUrls: ['./path-finding-visualizer.component.scss']
})
export class PathFindingVisualizerComponent implements OnInit {
  grid              : Node[][];
  mouseIsPressed    : boolean = false;
  animating         : boolean = false;
  needReset         : boolean = false;
  animeSpeed        : number = 1;
  endNode           : Node;
  dragging          : boolean = false;
  currentAlgorithm  : string = "dijkstra";
  displayExplanation: boolean = false;

  animeSpeedOptions = [
    { name: "0.25x",value: .25},
    { name: "0.5x",value: .5},
    { name: "1.0x",value: 1},
    { name: "1.5x",value: 1.5},
    { name: "2.0x",value: 2}
  ]

  algorithmOptions = [
    { name: "Dijkstra", value: "dijkstra"},
    { name: "A*", value: "a_star"},
    { name: "Breadth First", value: "bfs"},
    { name: "Depth First", value: "dfs"}
  ]

  constructor() { }

  ngOnInit(): void {
    this.grid = this.getInitialGrid();
  }

  handleMouseDown(row: number, col: number) {
    if(this.dragging) return;
    this.mouseIsPressed = true;
    this.getNewGridWithWallToggled(this.grid, row, col);
  }

  handleMouseOver(row: number, col: number) {
    if(!this.mouseIsPressed || this.dragging) return;
    this.getNewGridWithWallToggled(this.grid,row,col);
  }

  handleMouseUp() {
    this.mouseIsPressed = false;
  }

  /**
   * animates visited nodes then when end node is reached animates nodes in shortest path
   * @param visitedNodesInOrder nodes visited in dijkstra order
   * @param nodesInShortestPathOrder All nodes that are part of shortest path
   */
  animate(visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[],showDelay:boolean): void {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder,showDelay);
        },(10 * i * Number(showDelay)) / this.animeSpeed);
      } else {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
        },(10 * i * Number(showDelay)) / this.animeSpeed);
      }
    }
  }

  /**
   * Animates each node in shortest path in order
   * @param nodesInShortestPathOrder All nodes that are part of shortest path
   */
  animateShortestPath(nodesInShortestPathOrder: Node[],showDelay:boolean): void {
    //cancel if shortest path not found
    if(this.endNode.previousNode === null) {
      this.animating = false;
      return;
    }
    for (let i = 0; i < nodesInShortestPathOrder.length-1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path');
        this.animating = false;
        this.needReset = true;
      }, (50 * i * Number(showDelay)) / this.animeSpeed)
    }
  }


  /**
   * calls dijkstra algorithm and passes visited node/shortest path info
   * @param animeDelay flag to allow animation delay
   */
  visualize(animeDelay:boolean = true) {
    this.animating = true;
    const grid = this.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = this.endNode;
    let visitedNodesInOrder;
    let nodesInShortestPathOrder;

    switch (this.currentAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(grid,startNode,endNode);
        break;
      case "a_star": 
        visitedNodesInOrder = a_star(grid,startNode,endNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(grid,startNode,endNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid,startNode,endNode);
        break;
    }
    nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    this.animate(visitedNodesInOrder,nodesInShortestPathOrder,animeDelay);
  }

  reset() {
    this.grid = this.getInitialGrid();
    this.needReset = false;
  }

  showInfo() {
    this.displayExplanation = true;
    
  }

  getInitialGrid() : Node[][] {
    const grid = [];
    for (let row=0;row<NUM_ROWS;row++) {
      const currentRow = [];
      for (let col=0;col<NUM_COLS;col++) {
        currentRow.push(this.createNode(col,row));
      }
      grid.push(currentRow);
    }
    this.endNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    return grid;
  }

  @ViewChildren('allNodes') allNodes: QueryList<any>;
  
  ngAfterViewInit() {
    this.reset();
    this.allNodes.changes.subscribe( t => {
      this.addEndDragListener();
    })
  }

  updateListenersForEndNode() {
    let endNode = document.getElementById(`node-${this.endNode.row}-${this.endNode.col}`)
    endNode.draggable = true;
    (endNode.parentElement as any).removeAllListeners('mousedown');
    endNode.addEventListener("drag", event=>{
      this.moveEndNode(event);
    }, false);
  }

  /**
   * updates grid model and dom to remove old end node
   * @param event 
   */
  moveEndNode(event: Event) {
    this.dragging = true;
    let target: Element = <Element>event.target
    if(!target.classList.contains('node-finish')) return;
    let node = target;
    let rc = target.id.split("-");
    this.grid[rc[1]][rc[2]].isFinish = false;
    node.classList.remove('node-finish');
  }

  /**
   * Place end node during drag and update shortest path
   */
   placeEndNode(event:Event) {
    let target: Element = <Element>event.target
    if (target.classList.contains("node") && this.dragging) {
      let rc = target.id.split("-");
      let endNode = this.grid[rc[1]][rc[2]];

      //update grid model and dom classes
      endNode.isFinish = true;
      this.endNode = endNode;
      target.classList.add('node-finish');
    } else { //attempting to drag non tail node
      this.handleMouseUp()
    }
    this.dragging = false;
    if(this.needReset) this.visualize(false)
   }
  /**
   * adds drag event listener to end node
   */
  addEndDragListener() {
    this.updateListenersForEndNode(); 

    document.addEventListener("dragover", function(event) {
      // prevent default to allow drop
      event.preventDefault();
    }, false);

    document.addEventListener("drop", event => {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      this.placeEndNode(event);
      this.updateListenersForEndNode();
    }, false);
  }

  getNewGridWithWallToggled(grid: Node[][],row:number,col:number) {
    if(grid[row][col].isStart || grid[row][col].isFinish) return;
    grid[row][col].isWall=true;
    document.getElementById(`node-${row}-${col}`).classList.add('node-wall');
  }

  createNode(col: number, row: number) : Node
  {
    return new Node (
      col,
      row,
      row === START_NODE_ROW && col == START_NODE_COL, //start node
      row === FINISH_NODE_ROW && col === FINISH_NODE_COL, //finish node
      Infinity, //distance
      false, //visited
      false, //wall
      null, //Previous
      Infinity //f, for A*
    )
  }

}


import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined, isNumber } from 'util';

@Component({
  selector: 'app-ds-visualizer',
  templateUrl: './ds-visualizer.component.html',
  styleUrls: ['./ds-visualizer.component.scss']
})
export class DsVisualizerComponent implements OnInit {
  mouseIsPressed    : boolean = false;
  animating         : boolean = false;
  needReset         : boolean = false;
  animeSpeed        : number = 1;
  dragging          : boolean = false;
  displayExplanation: boolean = false;
  currentDS         : string = "bst";

  animeSpeedOptions = [
    { name: "0.25x",value: .25},
    { name: "0.5x",value: .5},
    { name: "1.0x",value: 1},
    { name: "1.5x",value: 1.5},
    { name: "2.0x",value: 2}
  ]

  dsOptions = [
    { name: "Trie", value: "trie"},
    { name: "AVL Tree", value: "avl-tree"},
    { name: "Binary Search Tree", value: "bst"}


  ]

  constructor() { }

  ngOnInit(): void {
  }

  visualize() {

  }

  insert() {
    const args = (document.getElementById("ds-values") as HTMLTextAreaElement).value;
    const csv = parseArguments(args);
    console.log(csv);

  }

  reset() {

  }

  showInfo() {

  }
}

function parseArguments(args: string): number[] {
  return args.split(',').filter(x=> (Number(x) || Number(x)===0) && x!=="").map(x=>+x);
}
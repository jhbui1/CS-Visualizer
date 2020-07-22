import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from '../ds-interfaces/tree-node';
import { DsBusService } from '../ds-bus.service';
import { Router } from '@angular/router';
import { HeapComponent } from '../heap/heap.component';

@Component({
  selector: 'app-ds-visualizer',
  templateUrl: './ds-visualizer.component.html',
  styleUrls: [
    './ds-visualizer.component.scss',
    '../../shared/visualizer-container.scss'
  ]
})
export class DsVisualizerComponent implements OnInit {
  @ViewChild(HeapComponent) heapChild: HeapComponent;

  mouseIsPressed    : boolean  = false;
  animating         : boolean  = false;
  needReset         : boolean  = false;
  animeSpeed        : number   = 1;
  dragging          : boolean  = false;
  displayExplanation: boolean  = false;
  currentDS         : string   = "heap";
  data              : string[] = [];
  dataBusSub;
  root              : TreeNode;

  animeSpeedOptions = [
    { name: "0.25x",value: 4},
    { name: "0.5x",value: 2},
    { name: "1.0x",value: 1},
    { name: "1.5x",value: 0.66},
    { name: "2.0x",value: .5}
  ]

  dsOptions = [
    { name: "Heap", value: "heap"},
    { name: "Trie", value: "trie"},
  ]

  constructor(
    private dataBus: DsBusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataBusSub = this.dataBus.dataChange.subscribe((value) => {
      this.data = value;
    })
  }

  find() {
    const textAreaInput = (document.getElementById("ds-values") as HTMLTextAreaElement);
    const searchWord = textAreaInput.value.trim();
    this.dataBus.findData(searchWord);
  }

  insert() {
    const textAreaInput = (document.getElementById("ds-values") as HTMLTextAreaElement);
    if(this.dataBus.data.length === 0) {
      this.dataBus.createData(parseArguments(textAreaInput.value));
    } else {
      this.dataBus.insertData(parseArguments(textAreaInput.value));
    }
    textAreaInput.value = "";
  }

  redirectTo(route: string) {
    console.log(route);
    this.router.navigate([route]);
  }


  reset() {
    this.dataBus.clearData();
  }

  showInfo() {
    this.displayExplanation = true;
    const helpSection = document.getElementById('explanation');
    helpSection.scrollIntoView({behavior:'smooth',block:'center'});
  }
}

function parseArguments(args: string): string[] {
  return args.split(',');
  // returns all numbers;
  // return args.split(',').filter(x=> (Number(x) || Number(x)===0) && x!=="").map(x=>+x);
}
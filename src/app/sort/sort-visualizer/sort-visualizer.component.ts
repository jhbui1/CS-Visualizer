import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sort-visualizer',
  templateUrl: './sort-visualizer.component.html',
  styleUrls: [
    './sort-visualizer.component.scss',
    '../../shared/visualizer-container.scss'
]
})
export class SortVisualizerComponent implements OnInit {
  animating         : boolean = false;
  animeSpeed        : number = 1;
  endNode           : Node;
  dragging          : boolean = false;
  currentAlgorithm  : string = "merge";
  displayExplanation: boolean = false;

  algorithmOptions = [
    { name: "Merge Sort", value: "merge"},
    { name: "Quick Sort", value: "quick"},
    { name: "Insertion Sort", value: "insertion"},
    { name: "Radix Sort", value: "radix"}
  ]

  animeSpeedOptions = [
    { name: "0.25x",value: .25},
    { name: "0.5x",value: .5},
    { name: "1.0x",value: 1},
    { name: "1.5x",value: 1.5},
    { name: "2.0x",value: 2}
  ]

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  reset() {

  }

  sort() {

  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  showInfo() {
    this.displayExplanation = true;
  }

}

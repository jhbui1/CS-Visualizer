import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentFactory, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnComponent } from '../column/column.component';
import { mergeSort } from '../algorithms/merge-sort';

@Component({
  selector: 'app-sort-visualizer',
  templateUrl: './sort-visualizer.component.html',
  styleUrls: [
    './sort-visualizer.component.scss',
    '../../shared/visualizer-container.scss'
]
})
export class SortVisualizerComponent implements OnInit {
  maxValue          : number = 200;
  arraySize         : number = 100;
  animating         : boolean = false;
  animeSpeed        : number = 1;
  endNode           : Node;
  dragging          : boolean = false;
  currentAlgorithm  : string = "merge";
  displayExplanation: boolean = false;
  columnRefs        : ComponentRef<ColumnComponent>[] = [];

  algorithmOptions = [
    { name: "Merge Sort", value: "merge"},
    { name: "Quick Sort", value: "quick"},
    { name: "Insertion Sort", value: "insertion"},
    { name: "Radix Sort", value: "radix"}
  ]

  animeSpeedOptions = [
    { name: "0.25x",value: 4},
    { name: "0.5x",value: 2},
    { name: "1.0x",value: 1},
    { name: "1.5x",value: .667},
    { name: "2.0x",value: .5}
  ]

  @ViewChild('arrayContainer', {read: ViewContainerRef}) entry: ViewContainerRef;
  private columnFactory: ComponentFactory<ColumnComponent>;

  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    this.columnFactory = this.resolver.resolveComponentFactory(ColumnComponent);
  }

  ngAfterViewInit() {
    this.generateArray();
  }

  generateArray() {
    for(let i=0;i<this.arraySize;i++) {
      const magnitude = Math.random();
      const value = Math.floor(this.maxValue * magnitude);
      const column = document.getElementById(`array-index-${i}`);
      if (Boolean(column)) { //div already exists
        this.columnRefs[i].instance.magnitude = magnitude;
        this.columnRefs[i].instance.value = value;
      } else {
        this.createColumn(i,magnitude,value);
      }
    }
  }

  /**
   * creates a column at given index 
   * @param index 
   * @param magnitude 
   */
  createColumn(index: number, magnitude: number,value: number) {
    const componentRef                    = this.entry.createComponent(this.columnFactory);
          componentRef.instance.index     = index;
          componentRef.instance.magnitude = magnitude;
          componentRef.instance.value     = value;
          componentRef.instance.id        = `array-index-${index}`;
    
    this.columnRefs.push(componentRef);
  }

  reset() {
    this.generateArray();
  }

  sort() {
    this.animating = true;
    switch(this.currentAlgorithm) {
      case 'merge':
        mergeSort(this.columnRefs,this.columnRefs.map(x=>x.instance.magnitude),
        this.maxValue,0,this.animeSpeed);
        break;
      case 'quick':
        break;
      case 'insertion':
        break;
      case 'radix':
        break;
    }
    this.animating = false;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  updateArray() {
    if(this.arraySize < 0 || this.arraySize > 100) {
      alert("Please enter a size between 0 and 100");
      (document.getElementById('size-input') as HTMLInputElement).value="100";
    } 
    if(this.maxValue < 0 || this.maxValue > 1000) {
      alert("Please enter a size between 0 and 1000");
      (document.getElementById('mag-input') as HTMLInputElement).value="100";
    }
    this.generateArray();    
  }
 

  showInfo() {
    this.displayExplanation = true;
  }

}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
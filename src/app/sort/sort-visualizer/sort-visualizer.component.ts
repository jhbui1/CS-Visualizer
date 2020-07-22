import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentFactory, ComponentRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

import { ColumnComponent } from '../column/column.component';
import { mergeSort } from '../algorithms/merge-sort';
import { quickSort } from '../algorithms/quick-sort';
import { insertionSort } from '../algorithms/insertion-sort';
import { radixSort } from '../algorithms/radix-sort';
import { BucketService } from '../bucket.service';

@Component({
  selector: 'app-sort-visualizer',
  templateUrl: './sort-visualizer.component.html',
  styleUrls: [
    './sort-visualizer.component.scss',
    '../../shared/visualizer-container.scss'
  ],
  providers: [
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ]
})
export class SortVisualizerComponent implements OnInit {
  maxValue          : number = 200;
  arraySize         : number = 100;
  maxArraySize      : number = 100;
  animating         : boolean = false;
  animeSpeed        : number = 1;
  endNode           : Node;
  dragging          : boolean = false;
  currentAlgorithm  : string = "radix";
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
    private resolver: ComponentFactoryResolver,
    private bucketService: BucketService
  ) { }

  ngOnInit(): void {
    this.columnFactory = this.resolver.resolveComponentFactory(ColumnComponent);
  }

  ngAfterViewInit() {
    this.determineMaxSize(window.innerWidth);
    this.generateArray();
  }

  determineMaxSize(width:number) {
    if (width <= 768) {
      this.maxArraySize = 25;
    }
    else if (width <= 1250) {
      this.maxArraySize = 50;
    }
    else if (width <= 1500) {
      this.maxArraySize = 70;
    }
    else {
      this.maxArraySize = 100;
    }
    if (this.maxArraySize > this.arraySize) {
      this.arraySize = this.maxArraySize;
      this.generateArray();
    } else if(this.maxArraySize < this.arraySize){
      this.deleteExtraColumns(this.maxArraySize);
    }
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
    location.reload();
  }

  sort() {
    this.animating = true;
    switch(this.currentAlgorithm) {
      case 'merge':
        mergeSort(this.columnRefs,this.columnRefs.map(x=>x.instance.magnitude),
        this.maxValue,0,this.animeSpeed);
        break;
      case 'quick':
        quickSort(this.columnRefs,0,this.arraySize-1,this.animeSpeed);
        break;
      case 'insertion':
        insertionSort(this.columnRefs,this.columnRefs.map(x => x.instance.magnitude),this.maxValue,this.animeSpeed);
        break;
      case 'radix':
        radixSort(this.columnRefs,this.columnRefs.map(x => x.instance.value),this.maxValue,this.animeSpeed,this.bucketService);
        break;
    }
    this.animating = false;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  updateArray() {
    if(this.arraySize < 0 || this.arraySize > this.maxArraySize) {
      alert(`Please enter a size between 0 and ${this.maxArraySize}`);
      (document.getElementById('size-input') as HTMLInputElement).value=String(this.maxArraySize);
    } 
    if(this.maxValue < 0 || this.maxValue > 1000) {
      alert("Please enter a size between 0 and 1000");
      (document.getElementById('mag-input') as HTMLInputElement).value="1000";
    }
    this.generateArray();    
  }
 

  showInfo() {
    this.displayExplanation = true;
    const helpSection = document.getElementById('explanation');
    helpSection.scrollIntoView({behavior:'smooth',block:'center'});
  }

  deleteExtraColumns(start: number) {
    this.arraySize = start;
    for(let i=this.columnRefs.length-1;i>=start;i--) {
      this.columnRefs[i].destroy();
      this.columnRefs.pop();
    }
  }

}

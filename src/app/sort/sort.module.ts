import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortVisualizerComponent } from './sort-visualizer/sort-visualizer.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SortVisualizerComponent
  ],
  exports: [SortVisualizerComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SortModule { }

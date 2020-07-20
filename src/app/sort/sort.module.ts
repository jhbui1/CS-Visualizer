import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortVisualizerComponent } from './sort-visualizer/sort-visualizer.component';
import { FormsModule } from '@angular/forms';
import { ColumnComponent } from './column/column.component';
import { RadixComponent } from './radix/radix.component';



@NgModule({
  declarations: [
    SortVisualizerComponent,
    ColumnComponent,
    RadixComponent
  ],
  exports: [SortVisualizerComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class SortModule { }

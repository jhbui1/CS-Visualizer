import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsVisualizerComponent } from './ds-visualizer/ds-visualizer.component';
import { FormsModule } from '@angular/forms';
import { NodeComponent } from './node/node.component';

@NgModule({
  declarations: [DsVisualizerComponent, NodeComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DsVisualizerComponent
  ]

})
export class DataStructureModule { }

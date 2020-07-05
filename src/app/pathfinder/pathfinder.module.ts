import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathFindingVisualizerComponent } from './path-finding-visualizer/path-finding-visualizer.component';
import { NodeComponent } from './node/node.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PathFindingVisualizerComponent,
    NodeComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    PathFindingVisualizerComponent
  ]
})
export class PathfinderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsVisualizerComponent } from './ds-visualizer/ds-visualizer.component';
import { FormsModule } from '@angular/forms';
import { NodeComponent } from './node/node.component';
import { TrieComponent } from './trie/trie.component';

@NgModule({
  declarations: [
    DsVisualizerComponent, 
    NodeComponent, 
    TrieComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DsVisualizerComponent
  ]

})
export class DataStructureModule { }

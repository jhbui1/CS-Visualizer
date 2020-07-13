import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsVisualizerComponent } from './ds-visualizer/ds-visualizer.component';
import { FormsModule } from '@angular/forms';
import { TrieComponent } from './trie/trie.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeapComponent } from './heap/heap.component';

@NgModule({
  declarations: [
    DsVisualizerComponent, 
    TrieComponent, 
    HeapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  exports: [
    DsVisualizerComponent
  ]

})
export class DataStructureModule { }

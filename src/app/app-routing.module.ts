import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PathFindingVisualizerComponent } from './pathfinder/path-finding-visualizer/path-finding-visualizer.component';
import { DsVisualizerComponent } from './data-structure/ds-visualizer/ds-visualizer.component';
import { SortVisualizerComponent } from './sort/sort-visualizer/sort-visualizer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'path-finder', component: PathFindingVisualizerComponent},
  { path: 'data-structures', component: DsVisualizerComponent},
  { path: 'sorting', component: SortVisualizerComponent},
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

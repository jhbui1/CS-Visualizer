import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathFindingVisualizerComponent } from './path-finding-visualizer/path-finding-visualizer.component';

const routes: Routes = [
  { path: 'home', component: PathFindingVisualizerComponent },
  { path: '**', component: PathFindingVisualizerComponent }
  // { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

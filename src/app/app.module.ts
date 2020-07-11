import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PathfinderModule } from './pathfinder/pathfinder.module';
import { HomeComponent } from './home/home.component';
import { DataStructureModule } from './data-structure/data-structure.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PathfinderModule,
    DataStructureModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

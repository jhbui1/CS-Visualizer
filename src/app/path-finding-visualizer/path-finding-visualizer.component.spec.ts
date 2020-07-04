import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathFindingVisualizerComponent } from './path-finding-visualizer.component';

describe('PathFindingVisualizerComponent', () => {
  let component: PathFindingVisualizerComponent;
  let fixture: ComponentFixture<PathFindingVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathFindingVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathFindingVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

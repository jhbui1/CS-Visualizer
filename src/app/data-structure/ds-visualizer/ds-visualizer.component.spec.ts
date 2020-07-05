import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsVisualizerComponent } from './ds-visualizer.component';

describe('DsVisualizerComponent', () => {
  let component: DsVisualizerComponent;
  let fixture: ComponentFixture<DsVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

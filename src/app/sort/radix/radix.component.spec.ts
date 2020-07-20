import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadixComponent } from './radix.component';

describe('RadixComponent', () => {
  let component: RadixComponent;
  let fixture: ComponentFixture<RadixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, Input,  ElementRef, AfterViewInit} from '@angular/core';



@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements AfterViewInit{
  @Input() index    : number;  //position in array

  @Input() set magnitude(value:number ) {
    this.elementRef.nativeElement.style.setProperty('--magnitude',value);
    this._magnitude = value;
  }  //value/height of column
  get magnitude(): number {
    return this._magnitude;
  } 

  value: number;
  id: string;
  
  private _magnitude: number;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.id = this.id;
  }

  toggleClass(className:string) {
    const host = document.getElementById(this.id);
    const container = host.children[1];
    container.classList.toggle(className);
  }
}

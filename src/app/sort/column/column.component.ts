import { Component, OnInit, Input,  ElementRef} from '@angular/core';



@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  host: {'[id]':'id'}
})
export class ColumnComponent implements OnInit{
  @Input() index    : number;  //position in array
  @Input() id       : string;
  @Input() set magnitude(value:number ) {
    this.elementRef.nativeElement.style.setProperty('--magnitude',value);
    this._magnitude = value;
  }  //value/height of column
  get magnitude(): number {
    return this._magnitude;
  } 

  value: number;

  private _magnitude;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  toggleClass(className:string) {
    const host = document.getElementById(this.id);
    const container = host.children[1];
    container.classList.toggle(className);
  }
}

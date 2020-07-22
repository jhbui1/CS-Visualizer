import { Component, OnInit, Input,  ElementRef, ChangeDetectorRef} from '@angular/core';



@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  host: {'[id]':'_id'}
})
export class ColumnComponent implements OnInit{
  @Input() index    : number;  //position in array
  @Input() set id(id:string) {
    this._id = id;
    this.cdr.detectChanges();
  }
  @Input() set magnitude(value:number ) {
    this.elementRef.nativeElement.style.setProperty('--magnitude',value);
    this._magnitude = value;
  }  //value/height of column
  get magnitude(): number {
    return this._magnitude;
  } 

  value: number;

  private _id;
  private _magnitude;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  toggleClass(className:string) {
    const host = document.getElementById(this._id);
    const container = host.children[1];
    container.classList.toggle(className);
  }
}

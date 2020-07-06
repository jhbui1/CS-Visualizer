import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DsBusService {
  data: string[] = [];

  dataChange : Subject<string[]> = new Subject<string[]>();
  
  constructor() { }

  createData(data: string[]) {
    this.data = data;
    this.dataChange.next(this.data);
  }

  insertData(value: string[]) {
    this.data = this.data.concat(value);
    this.dataChange.next(this.data);
  }

}

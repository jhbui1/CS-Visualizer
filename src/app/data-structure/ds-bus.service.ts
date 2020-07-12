import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DsBusService {
  data: string[] = [];

  //use two subjects to differentiate between inserted and requested data
  searchData : Subject<string> = new Subject<string>();
  dataChange : Subject<string[]> = new Subject<string[]>();
  
  constructor() { }

  createData(data: string[]) {
    this.data = data;
    this.dataChange.next(this.data);
  }

  insertData(value: string[]) {
    this.data = this.data.concat(value);
    this.dataChange.next(value);
  }

  clearData() {
    this.data = [];
    this.dataChange.next(null);
  }

  findData(word: string) {
    this.searchData.next(word);
  }

}

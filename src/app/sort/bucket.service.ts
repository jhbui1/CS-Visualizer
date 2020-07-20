import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface BucketUpdate {
  radix: number,
  bucket: number,
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  bucketData: Subject<BucketUpdate> = new Subject<BucketUpdate>();

  constructor() { }

  /**
   * creates bucket update specifying radix of value to highlight 
   * and bucket to insert in
   * @param radix 
   * @param bucket 
   * @param value 
   */
  insert(radix:number,bucket:number,value:number) {
    const update: BucketUpdate = {radix,bucket,value};
    this.bucketData.next(update);
  }
}

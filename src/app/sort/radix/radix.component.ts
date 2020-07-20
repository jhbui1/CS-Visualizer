import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { BucketUpdate, BucketService } from '../bucket.service';

@Component({
  selector: 'app-radix',
  templateUrl: './radix.component.html',
  styleUrls: ['./radix.component.scss']
})
export class RadixComponent implements OnInit{

  buckets: Map<number,number[]> = new Map([
    [0,[]],
    [1,[]],
    [2,[]],
    [3,[]],
    [4,[]],
    [5,[]],
    [6,[]],
    [7,[]],
    [8,[]],
    [9,[]]
  ]);
  bucketKeys = [...this.buckets.keys()];

  constructor(
    private bucketService: BucketService
  ) { }

  ngOnInit(): void {
    this.bucketService.bucketData.subscribe( (bucketUpdate) => {
      this.updateBucket(bucketUpdate);
    })
  }


  updateBucket(bucketUpdate: BucketUpdate) {
    console.log(this.buckets.get(bucketUpdate.bucket));
    debugger;
    this.buckets.get(bucketUpdate.bucket).unshift(bucketUpdate.value);
  }

}

import { Component, OnInit} from '@angular/core';
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
  delay: number;

  constructor(
    private bucketService: BucketService
  ) { }

  ngOnInit(): void {
    this.delay = 0;
    this.bucketService.bucketData.subscribe( (bucketUpdate) => {
      if(Boolean(bucketUpdate)) {
        this.updateBucket(bucketUpdate);
      } else {
        this.pop();
      }
    })
  }

  updateBucket(bucketUpdate: BucketUpdate) {
    this.buckets.get(bucketUpdate.bucket).push(bucketUpdate.value);
    const numbers = document.getElementsByClassName(`radix-${bucketUpdate.radix}`);
    for(let i=0;i<numbers.length;i++) {
      numbers[i].classList.add('highlight');
    }
  }

  pop() {
    this.delay = 0;
    let i = 0;
    for (const bucket of this.buckets.values()) {
      for(const _ of bucket) {
        setTimeout ((i) => {
          document.getElementById(`bucket-${i}-idx-0`).classList.add('remove');
        },this.delay,i);
        this.delay += this.bucketService.animDelay;

        setTimeout (() => {
          bucket.shift();
        },this.delay);
      }
      i++;
    }
  }

  String(n: number) {
    return String(n).split("");
  }

}

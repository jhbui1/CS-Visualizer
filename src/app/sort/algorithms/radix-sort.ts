import { BucketService } from '../bucket.service';

export function radixSort(columns: import("@angular/core").ComponentRef<import("../column/column.component").ColumnComponent>[],
    values: number[],
    bucketService: BucketService
) {
    console.log(values);
    let delay = 0;
    let animDelay = 100;

    let maxLength = largestNum(values);

    for (let i = 0; i < maxLength; i++) {
      let buckets:any = Array.from({ length: 10 }, () => []);
  
      for (let j = 0; j < values.length; j++) {
        let num = getNum(values[j], i);
  
        if (num !== undefined) {
            buckets[num].push(values[j]);
            setTimeout( (bucket,value) => {
                bucketService.insert(i,bucket,value);
            },delay+animDelay,Number(num),values[j]);
            delay += animDelay;
        }
      };
      values = buckets.flat();
    };
    console.log(values)
    return values;
}

function getNum(num, index) {
    const strNum = String(num);
    let end = strNum.length - 1;
    const foundNum = strNum[end - index];
  
    if (foundNum === undefined) return 0;
    else return foundNum;
};

const largestNum = arr => {
    let largest = "0";
  
    arr.forEach(num => {
      const strNum = String(num);
  
      if (strNum.length > largest.length) largest = strNum;
    });
  
    return largest.length;
};
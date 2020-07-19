import { ComponentRef } from '@angular/core';
import { ColumnComponent } from '../column/column.component';

/**
 * performs meregesort on array of columns by swapping their magnitudes
 * returns an array of objects containing a pair of columns and boolean indicating if they were swapper or not  
 * @param columns references to columns to be updated after merging
 * @param section current section being sorted
 * @param maxValue max column value
 * @param offset offset ofcurrent section from 0 index
 */
export function mergeSort(
    columns: ComponentRef<ColumnComponent>[],
    section: number[],
    maxValue: number,
    offset: number,
    multiplier: number,
    )  {
    // No need to sort the array if the array only has one element or empty
    if (section.length <= 1) {
        return section;
    }
    const middle = Math.floor(section.length / 2);

    const left = section.slice(0, middle);
    const right = section.slice(middle);

    // Using recursion to combine the left and right
    const merged = merge(
        mergeSort(columns,left,maxValue,offset,multiplier), 
        mergeSort(columns,right,maxValue,offset+middle,multiplier)
    );
    const animDelay = 100;
    const sectionDelay = section.length * animDelay;  
    //colorize section delimitiers
    setTimeout( () => {
        columns[offset].instance.toggleClass('section-delimiter');
        columns[offset+section.length-1].instance.toggleClass('section-delimiter');
    },sectionDelay * multiplier);

    for(let i=0;i<merged.length;i++) {
        setTimeout(() => {
            columns[offset+i].instance.toggleClass('swapping');
        },((animDelay * i) + sectionDelay) * multiplier);

        setTimeout(() => {
            columns[offset+i].instance.magnitude = merged[i]; 
            columns[offset+i].instance.value = Math.floor(merged[i] * maxValue);
            columns[offset+i].instance.toggleClass('swapping');

        },((animDelay * (i + 1)) + sectionDelay) * multiplier);
    }

    //restore delimiter color
    setTimeout( () => {
        columns[offset].instance.toggleClass('section-delimiter');
        columns[offset+section.length-1].instance.toggleClass('section-delimiter');
    },((animDelay * merged.length) + sectionDelay) * multiplier);

    return merged;
}

function merge (left, right) {
    let resultArray = [], leftIndex = 0, rightIndex = 0;
  
    // We will concatenate values into the resultArray in order
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        resultArray.push(left[leftIndex]);
        leftIndex++; // move left array cursor
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++; // move right array cursor
      }
    }
  
    // We need to concat here because there will be one element remaining
    // from either left OR the right
    return resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
  }
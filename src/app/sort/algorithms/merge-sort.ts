import { ComponentRef } from '@angular/core';
import { ColumnComponent } from '../column/column.component';

/**
 * performs meregesort on array of columns by swapping their magnitudes
 * returns an array of objects containing a pair of columns and boolean indicating if they were swapper or not  
 * @param columns 
 */
export function mergeSort(columns: ComponentRef<ColumnComponent>[])  {
    if (columns.length > 1) {
        const mid = Math.floor(columns.length / 2);
        const newArray = columns.map(a => Object.assign({}, a));
        const left = newArray.slice(0,mid);
        const right = newArray.slice(mid);

        mergeSort(left);
        mergeSort(right);

        let i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i].instance.value < right[j].instance.value) {
                newArray[k].instance.magnitude = left[i].instance.magnitude;
                i++;
            } else {
                newArray[k].instance.magnitude = right[j].instance.magnitude;
                j++;
            }
        }

        while (i < left.length) {
            newArray[k].instance.magnitude = left[i].instance.magnitude;
            i++;
            k++;
        }

        while (j < right.length) {
            newArray[k].instance.magnitude = right[j].instance.magnitude;
            j++;
            k++;
        }
    }
}
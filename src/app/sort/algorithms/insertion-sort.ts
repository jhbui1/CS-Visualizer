import { ComponentRef } from '@angular/core';
import { ColumnComponent } from '../column/column.component';

let animeDelay = 100;
let delay = 0;

export function insertionSort(
    columns:ComponentRef<ColumnComponent>[],
    values: number[],
    maxValue,
    multiplier = 1
) {
    animeDelay = 100 * multiplier;
    delay = 0;
    for (let i=0;i<values.length;i++) {
        setTimeout( (i) => {
            columns[i].instance.toggleClass('section-delimiter');
        },delay,i);
        delay += animeDelay; 

        let key = values[i];
        let j = i - 1;
        while (j >=0 && values[j] > key ) {
            values[j+1] = values[j];
            setTimeout( (j,val) => {
                columns[j].instance.toggleClass('swapping');
                columns[j+1].instance.toggleClass('swapping');
                columns[j+1].instance.magnitude = val;
                columns[j+1].instance.value = Math.floor(val * maxValue);
            },delay,j,values[j])
            delay += animeDelay;

            setTimeout( (j) => {
                columns[j].instance.toggleClass('swapping');
                columns[j+1].instance.toggleClass('swapping');
            },delay,j)
            delay += animeDelay;
            j--;
        }

        values[j + 1] = key;
        setTimeout((j,key) => {
            columns[i].instance.toggleClass('section-delimiter');
            columns[j+1].instance.toggleClass('section-delimiter');
            columns[j+1].instance.magnitude = key;
            columns[j+1].instance.value = Math.floor(key * maxValue);
        },delay,j,key);
        delay += animeDelay;
        
        setTimeout ((j) => {
            columns[j+1].instance.toggleClass('section-delimiter');
        },delay,j);
        delay += animeDelay;
    }
    return animeDelay;
}
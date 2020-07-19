import { ComponentRef } from '@angular/core';
import { ColumnComponent } from '../column/column.component';

let animDelay: number = 100;
let delay: number = 0;

export function quickSort(columns: ComponentRef<ColumnComponent>[],
    left: number, right: number, multiplier: number = 1
) {
    animDelay = 100 * multiplier;
    delay = 0;
    const values = columns.map(x => x.instance.magnitude);
    quickSortRec(columns,values,left,right);
}
       

function quickSortRec(columns: ComponentRef<ColumnComponent>[], values:number[],
    left: number, right: number
) {
    var index: number;
    if (columns.length > 1) {
        index = partition(columns, values, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSortRec(columns, values, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSortRec(columns, values, index, right);
        }
    }
    return columns;
}

function partition(columns: ComponentRef<ColumnComponent>[], values: number[],
    left: number,right: number
) {
    const mid = Math.floor((right + left) / 2);
    var pivot   = values[mid], //middle element
    i       = left, //left pointer
    j       = right; //right pointer

    setTimeout(()=>{
        columns[mid].instance.toggleClass('section-delimiter');
    },delay+animDelay);
    delay+=animDelay;

    while (i <= j) {
        while (values[i] < pivot) {
            i++;
        }
        while (values[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(columns, values, i, j); 
            i++;
            j--;
        }
    }

    setTimeout(() => {
        columns[mid].instance.toggleClass('section-delimiter');
    },delay+animDelay)
    delay+=animDelay;

    return i;

    
}

function swap(columns: ComponentRef<ColumnComponent>[], values: number[],
    a: number,
    b: number
) {
    const columnA = columns[a];
    const columnB = columns[b];
    
    const temp = values[a];
    values[a] = values[b];
    values[b] = temp;

    setTimeout(() =>{
        columnA.instance.toggleClass('swapping');
        columnB.instance.toggleClass('swapping'); 
        var [magA,valA]                = [columnA.instance.magnitude,columnA.instance.value];
            columnA.instance.magnitude = columnB.instance.magnitude;
            columnA.instance.value     = columnB.instance.value;
            columnB.instance.magnitude = magA;
            columnB.instance.value     = valA;

    },delay+animDelay)

    delay+=animDelay;

    setTimeout(() =>{
        columnA.instance.toggleClass('swapping');
        columnB.instance.toggleClass('swapping');
    },delay+animDelay)
    delay+=animDelay;
}
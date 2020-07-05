import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pathfinder-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() col           : Number;
  @Input() row           : Number;
  @Input() isFinish      : boolean;
  @Input() isStart       : boolean;
  @Input() isWall        : boolean;
  @Input() onMouseDown   
  @Input() onMouseEnter 
  @Input() onMouseUp
  extraClassName: string;
  
  constructor() { 

  }

  ngOnInit(): void {
    this.extraClassName = this.isFinish 
      ? 'node-finish'
      : this.isStart
      ? 'node-start'
      : this.isWall
      ? 'node-wall'
      : '';
  }

}

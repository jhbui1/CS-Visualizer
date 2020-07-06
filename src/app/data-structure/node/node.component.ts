import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() children;
  @Input() parent;
  @Input() value;

  constructor() { }

  ngOnInit(): void {
  }

}

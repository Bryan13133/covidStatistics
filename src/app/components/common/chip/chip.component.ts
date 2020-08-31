import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pk-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.sass']
})
export class ChipComponent implements OnInit {

  @Input('severity') severity: string;
  @Input('value') value: number | string;

  constructor() { }

  ngOnInit(): void {
  }

}

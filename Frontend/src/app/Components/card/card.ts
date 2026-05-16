import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class Card implements OnInit {
  str = 'string';

  @Output()
  stringEvent = new EventEmitter<string>();

  @Input()
  product!: Iproduct;

  ngOnInit(): void {
    this.stringEvent.emit(this.str);
  }
}

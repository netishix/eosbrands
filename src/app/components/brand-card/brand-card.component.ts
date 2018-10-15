import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Brand } from '../../types';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {

  @Input() brand: Brand;
  @Output() buy: EventEmitter<Brand> = new EventEmitter<Brand>();
  public secondsLeft: number;
  constructor() { }

  ngOnInit() {
    this.secondsLeft = this.brand.expiresAt - Date.now() / 1000;
  }

  public buyBrand(brand) {
    this.buy.emit(brand);
  }

}

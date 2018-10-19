import { Component, OnInit } from '@angular/core';
import { AppService } from '../..//services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-last-buyers',
  templateUrl: './modal-last-buyers.component.html',
  styleUrls: ['./modal-last-buyers.component.scss']
})
export class ModalLastBuyersComponent implements OnInit {

  public lastBuyers: any[];
  public moment: any;

  constructor(public _AppService: AppService) { }

  ngOnInit() {
    this.lastBuyers = this._AppService.gameData.lastBuyers;
    this.moment = moment;
  }

}

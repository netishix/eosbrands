import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-leaderboard',
  templateUrl: './modal-leaderboard.component.html',
  styleUrls: ['./modal-leaderboard.component.scss']
})
export class ModalLeaderboardComponent implements OnInit {
  public ranking: {
    account: string,
    owned: number,
    totalValue: number
  }[];

  constructor(public _AppService: AppService, public _NgbActiveModal: NgbActiveModal) { }

  ngOnInit() {
    this.ranking = [];
    this._AppService.gameData.brands.forEach((brand) => {
      const foundUser = this.ranking.find((pos) => pos.account === brand.owner);
      if (!foundUser) {
        const user = brand.owner;
        let totalValue = 0;
        const ownedBrands = this._AppService.gameData.brands.filter(b => b.owner === user);
        ownedBrands.forEach((b) => {
          const value = parseFloat(b.price.split(' ')[0]);
          totalValue += value;
        });
        this.ranking.push({
          account: user,
          owned: ownedBrands.length,
          totalValue: totalValue
        });
      }
    });
    this.ranking = this.ranking.sort(( a, b ) => {
      return b.totalValue - a.totalValue;
    });
  }

}

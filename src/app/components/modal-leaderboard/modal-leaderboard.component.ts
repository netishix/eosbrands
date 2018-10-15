import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'app-modal-leaderboard',
  templateUrl: './modal-leaderboard.component.html',
  styleUrls: ['./modal-leaderboard.component.scss']
})
export class ModalLeaderboardComponent implements OnInit {
  public ranking: {
    account: string,
    owned: number,
    totalValue: string
  }[];

  constructor(public _AppService: AppService) { }

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
          totalValue: totalValue.toFixed(4) + ' EOS'
        });
      }
    });
    this.ranking = this.ranking.sort(( a, b ) => {
      return b.owned - a.owned;
    });
  }

}

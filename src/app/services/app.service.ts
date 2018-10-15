import { Injectable, } from '@angular/core';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import { Constants } from '../constants';
import { Brand } from '../types';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  public scatter: any;
  public loggedUser: any;
  public gameData: {
    game: {
      secondsLeft: number,
      invested: string,
      pot: string,
      lastBuyer: string
    },
    brands: Brand[],
    balance: any,
    accounts: any[];
  };

  constructor() {
    if (typeof window !== 'undefined') {
      ScatterJS.plugins(new ScatterEOS());
      ScatterJS.scatter.connect('EOS Brands')
        .then(connected => {
          this.scatter = ScatterJS.scatter;
          if (this.scatter.identity) {
            this.login();
          }
        });
      this.refreshGame();
      setInterval(() => {
        this.refreshGame();
      }, 4000);
    }
    this.gameData = {
      game: null,
      brands: [],
      balance: null,
      accounts: []
    };

  }

  login() {
    const requiredFields = { accounts: [Constants.network] };
    return this.scatter.getIdentity(requiredFields)
      .then(() => {
        const account = this.scatter.identity.accounts.find(x => x.blockchain === Constants.network.blockchain);
        this.loggedUser = account;
      });
  }

  logout() {
    this.scatter.forgetIdentity();
    this.loggedUser = null;
  }

  refreshGame() {
    const eos = Eos({
      httpEndpoint: `${Constants.network.protocol}://${Constants.network.host}:${Constants.network.port}`,
      chainId: Constants.network.chainId
    });

    Promise.all([
      eos.getTableRows({
        code: Constants.network.code,
        scope: Constants.network.code,
        table: 'game',
        json: true,
        limit: 0
      }),
      eos.getTableRows({
        code: Constants.network.code,
        scope: Constants.network.code,
        table: 'brand',
        json: true,
        limit: 0
      }),
      eos.getTableRows({
        code: Constants.network.code,
        scope: Constants.network.code,
        table: 'account',
        json: true,
        limit: 0
      })
    ]).then((response) => {
      const gameTable = response[0].rows[0];
      this.gameData.game = {
        secondsLeft: gameTable.expiresAt - Date.now() / 1000,
        invested: gameTable.invested,
        pot: gameTable.pot,
        lastBuyer: gameTable.lastBuyer
      };
      this.gameData.brands = response[1].rows.sort((a, b) => {
        return b.purchasedTimes - a.purchasedTimes;
      });
      const accounts = response[2].rows;
      this.gameData.accounts = accounts;
      if (this.loggedUser) {
        const foundLoggedUser = accounts.find(user => user.account === this.loggedUser.name);
        this.gameData.balance = foundLoggedUser ? foundLoggedUser.balance : 0;
      } else {
        this.gameData.balance = 0;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../services/app.service';
import { Constants } from '../../constants';
import Eos from 'eosjs';
import { ModalCreateBrandComponent } from '../modal-create-brand/modal-create-brand.component';
import { ModalLeaderboardComponent } from '../modal-leaderboard/modal-leaderboard.component';
import { ModalLastBuyersComponent } from '../modal-last-buyers/modal-last-buyers.component';
import { ModalLastRoundComponent } from '../modal-last-round/modal-last-round.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public tab: 'all' | 'owned' | 'created';
  constructor(public _NgbModal: NgbModal, public _AppService: AppService) { }

  ngOnInit() {
    this.tab = 'all';
  }

  public openLeaderboard() {
    this._NgbModal.open(ModalLeaderboardComponent, {
      size: 'lg'
    });
  }

  public openLastBuyers() {
    this._NgbModal.open(ModalLastBuyersComponent, {
      size: 'lg'
    });
  }

  public openLastRound() {
    this._NgbModal.open(ModalLastRoundComponent, {
      size: 'lg'
    });
  }

  public createBrand() {
    if (this._AppService.loggedUser) {
      const modal = this._NgbModal.open(ModalCreateBrandComponent, {
        size: 'lg'
      });
      modal.result
        .then((formValue) => {
          const eosOptions = { expireInSeconds: 60 };
          const eos = this._AppService.scatter.eos(Constants.network, Eos, eosOptions);
          eos.transaction({
            actions: [
              {
                account: Constants.network.currency.EOS.code,
                name: 'transfer',
                authorization: [{
                  actor: this._AppService.loggedUser.name,
                  permission: this._AppService.loggedUser.authority
                }],
                data: {
                  from: this._AppService.loggedUser.name,
                  to: Constants.network.code,
                  quantity: '0.5000 EOS',
                  memo: 'EOS BRANDS - Create brand'
                }
              },
              {
                account: Constants.network.code,
                name: 'create',
                authorization: [{
                  actor: this._AppService.loggedUser.name,
                  permission: this._AppService.loggedUser.authority
                }],
                data: {
                  creator: this._AppService.loggedUser.name,
                  name: formValue.name,
                  image: formValue.image,
                }
              }
            ]
          }).then((transaction) => {
            alert('Okey! ' + formValue.name + ' is now alive!');
          })
          .catch(() => {
            alert('An error occured while creating the brand. Please try again');
          });
        })
        .catch((error) => {
          // modal was dismissed
        });
    } else {
      alert('You must login to create a brand');
    }
  }

  public onBuyBrand(brand) {
    if (this._AppService.loggedUser) {
      const eosOptions = { expireInSeconds: 60 };
      const eos = this._AppService.scatter.eos(Constants.network, Eos, eosOptions);
      eos.transaction({
        actions: [
          {
            account: Constants.network.currency.EOS.code,
            name: 'transfer',
            authorization: [{
              actor: this._AppService.loggedUser.name,
              permission: this._AppService.loggedUser.authority
            }],
            data: {
              from: this._AppService.loggedUser.name,
              to: Constants.network.code,
              quantity: brand.price,
              memo: 'EOS BRANDS - Brand purchase'
            }
          },
          {
            account: Constants.network.code,
            name: 'buy',
            authorization: [{
              actor: this._AppService.loggedUser.name,
              permission: this._AppService.loggedUser.authority
            }],
            data: {
              id: brand.id,
              buyer: this._AppService.loggedUser.name
            }
          }
        ]
      }).then((transaction) => {
        alert('Great! You are the owner of ' + brand.name);
      }).catch(() => {
        alert('An error occured while buying the brand. Please try again');
      });
    } else {
      alert('You must login to buy a brand');
    }
  }

  public withdraw() {
    const eosOptions = { expireInSeconds: 60 };
    const eos = this._AppService.scatter.eos(Constants.network, Eos, eosOptions);
    eos.transaction({
      actions: [
        {
          account: Constants.network.code,
          name: 'withdraw',
          authorization: [{
            actor: this._AppService.loggedUser.name,
            permission: this._AppService.loggedUser.authority
          }],
          data: {
            to: this._AppService.loggedUser.name
          }
        }
      ]
    }).then((transaction) => {
    }).catch(() => {
      alert('An error occured while withdrawing. Please try again');
    });
  }

  public ownedFilter() {
    const brands = this._AppService.gameData.brands.filter(brand => brand.owner === this._AppService.loggedUser.name);
    return brands;
  }

  public createdFilter() {
    const brands = this._AppService.gameData.brands.filter(brand => brand.creator === this._AppService.loggedUser.name);
    return brands;
  }



}

import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game/game.component';
import { ModalCreateBrandComponent } from './components/modal-create-brand/modal-create-brand.component';
import { ModalWtfComponent } from './components/modal-wtf/modal-wtf.component';
import { AppService } from './services/app.service';
import { ModalLeaderboardComponent } from './components/modal-leaderboard/modal-leaderboard.component';
import { ModalLastBuyersComponent } from './components/modal-last-buyers/modal-last-buyers.component';
import { ModalLastRoundComponent } from './components/modal-last-round/modal-last-round.component';
import { BrandCardComponent } from './components/brand-card/brand-card.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameComponent,
    ModalCreateBrandComponent,
    ModalWtfComponent,
    ModalLeaderboardComponent,
    BrandCardComponent,
    ModalLastBuyersComponent,
    ModalLastRoundComponent,
  ],
  imports: [
 CommonModule,
NgtUniversalModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    CountdownModule,
  ],
  providers: [
    AppService
  ],
  entryComponents: [
    ModalCreateBrandComponent,
    ModalWtfComponent,
    ModalLeaderboardComponent,
    ModalLastBuyersComponent,
    ModalLastRoundComponent
  ],
})
export class AppModule { }

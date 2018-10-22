import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-last-round',
  templateUrl: './modal-last-round.component.html',
  styleUrls: ['./modal-last-round.component.scss']
})
export class ModalLastRoundComponent implements OnInit {

  constructor(public _NgbActiveModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

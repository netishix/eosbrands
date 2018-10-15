import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWtfComponent } from '../modal-wtf/modal-wtf.component';
import { AppService } from '../../services/app.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public _NgbModal: NgbModal, public _AppService: AppService) { }

  ngOnInit() {

  }

  wtf() {
    this._NgbModal.open(ModalWtfComponent, {
      size: 'lg',
    });
  }

}

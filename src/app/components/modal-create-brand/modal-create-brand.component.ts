import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AppValidators } from '../../validators/app.validators';
@Component({
  selector: 'app-modal-create-brand',
  templateUrl: './modal-create-brand.component.html',
  styleUrls: ['./modal-create-brand.component.scss']
})
export class ModalCreateBrandComponent implements OnInit {

  public brandForm: {
    isLoading: boolean,
    isSubmitted: boolean,
    formGroup: FormGroup,
    submit: Function
  } = {
      isLoading: false,
      isSubmitted: false,
      formGroup: this._FormBuilder.group({
        name: [null, Validators.compose([Validators.required, Validators.maxLength(30)])],
        image: [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      }),
      submit: () => {
        this.brandForm.isSubmitted = true;
        if (this.brandForm.formGroup.valid) {
          const formValue = this.brandForm.formGroup.value;
          this._NgbActiveModal.close(formValue);
        }
      }
    };

  constructor(public _NgbActiveModal: NgbActiveModal, public _FormBuilder: FormBuilder) { }
  ngOnInit() {
    const validatorFn = AppValidators.imageValidator();
    this.brandForm.formGroup.get('image').setAsyncValidators(validatorFn);
  }
}

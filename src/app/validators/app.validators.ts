import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

export class AppValidators {

  public static imageValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const promise = new Promise((res) => {
        const image = new Image();
        image.onload = function () {
          res(null);
        };
        image.onerror = function () {
          res({ notFound: true });
        };
        image.src = control.value;
      });
      return promise;
    };
  }

}

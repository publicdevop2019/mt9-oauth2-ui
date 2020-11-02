import { Component } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { ErrorMessage, IAggregateValidator, TValidatorContext } from './validation/validator-common';

export class ValidatorHelper {
  constructor() {
  }
  private previousErrors: ErrorMessage[] = [];
  public validate(validator: IAggregateValidator, getPayload: any, context: TValidatorContext, formgGroup: FormGroup, formInfo: IForm, cmpt: any, errorMapper: (original: ErrorMessage[], cmpt: any) => ErrorMessage[]): boolean {
    let errors = validator.validate(getPayload(cmpt), context);
    if (errors.length > 0) {
      let uniqueError: ErrorMessage[] = []
      errors.forEach(e => {
        if (uniqueError.some(ee => ee.ctrlKey === e.ctrlKey)) {
          //do nothing
        } else {
          uniqueError.push(e)
        }
      });
      let mapped = errorMapper(uniqueError, cmpt);
      this.previousErrors = mapped;
      let keys = mapped.map(e => e.ctrlKey);
      formInfo.inputs.forEach(input => {
        if (keys.includes(input.key)) {
          input.errorMsg = mapped.find(e => e.ctrlKey === input.key).message;
        } else {
          if (this.previousErrors.map(e => e.ctrlKey).includes(input.key))
            input.errorMsg = undefined;
        }
      })
      formgGroup.valueChanges.subscribe(next => {
        let newErrors = validator.validate(getPayload(cmpt), context)
        //sub for same key valueChange
        if (newErrors.length > 0) {
          let uniqueError2: ErrorMessage[] = []
          newErrors.forEach(e => {
            if (uniqueError2.some(ee => ee.ctrlKey === e.ctrlKey)) {
              //do nothing
            } else {
              uniqueError2.push(e)
            }
          });
          let mapped2 = errorMapper(uniqueError2, cmpt);
          let keys2 = mapped2.map(e => e.ctrlKey);
          let var0=this.previousErrors.map(e => e.ctrlKey);
          formInfo.inputs.forEach(input => {
            if (keys2.includes(input.key)) {
              input.errorMsg = mapped2.find(e => e.ctrlKey === input.key).message;
            } else {
              if (var0.includes(input.key))
                input.errorMsg = undefined;
            }
          })
          this.previousErrors = mapped2;
        } else {
          formInfo.inputs.forEach(e => e.errorMsg = undefined);
        }
      })
      return false
    } else {
      return true
    }
  }
  public static doNothingErrorMapper(original: ErrorMessage[]) {
    return original;
  }
}
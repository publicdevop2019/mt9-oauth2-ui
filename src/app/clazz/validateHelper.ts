import { Component } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, forkJoin, merge } from 'rxjs';
import { ErrorMessage, IAggregateValidator, TValidatorContext } from './validation/validator-common';

export class ValidatorHelper {
  constructor() {
  }
  private previousErrors: ErrorMessage[] = [];
  public validate(validator: IAggregateValidator, getPayload: any, context: TValidatorContext, fis: FormInfoService, cmpt: any, errorMapper: (original: ErrorMessage[], cmpt: any) => ErrorMessage[]): boolean {
    let errors = validator.validate(getPayload(cmpt), context);
    if (errors.length > 0) {
      let uniqueError: ErrorMessage[] = []
      errors.forEach(e => {
        if (uniqueError.some(ee => ee.ctrlKey === e.ctrlKey && ee.formId === e.formId)) {
          //do nothing
        } else {
          uniqueError.push(e)
        }
      });
      let mapped = errorMapper(uniqueError, cmpt);
      let keys = mapped.map(e => e.formId + "_" + e.ctrlKey);
      let uniqueFormIds = new Array(...new Set([...mapped.map(e => e.formId), ...this.previousErrors.map(e => e.formId)])).filter(e => e);
      let var1 = this.previousErrors.map(e => e.formId + "_" + e.ctrlKey);
      uniqueFormIds.forEach(id => {
        fis.formGroupCollection_formInfo[id].inputs.forEach(input => {
          if (keys.includes(id + "_" + input.key)) {
            input.errorMsg = mapped.find(e => e.formId + "_" + e.ctrlKey === id + "_" + input.key).message;
          } else {
            if (var1.includes(id + "_" + input.key)) {
              input.errorMsg = undefined;
            }
          }
        });
      })
      this.previousErrors = mapped;
      // fis.formGroupCollection['product'].valueChanges
      // fis.formGroupCollection['optionForm'].valueChanges
      // merge(fis.formGroupCollection['product'].valueChanges,fis.formGroupCollection['optionForm'].valueChanges)
      merge(...uniqueFormIds.map(e => fis.formGroupCollection[e].valueChanges))
      .subscribe(next => {
        let newErrors = validator.validate(getPayload(cmpt), context)
        //sub for same key valueChange
        if (newErrors.length > 0) {
          let uniqueError2: ErrorMessage[] = []
          newErrors.forEach(e => {
            if (uniqueError2.some(ee => ee.ctrlKey === e.ctrlKey && ee.formId === e.formId)) {
              //do nothing
            } else {
              uniqueError2.push(e)
            }
          });
          let mapped2 = errorMapper(uniqueError2, cmpt);
          let keys2 = mapped2.map(e => e.formId + "_" + e.ctrlKey);
          let var0 = this.previousErrors.map(e => e.formId + "_" + e.ctrlKey);
          uniqueFormIds.forEach(id => {
            fis.formGroupCollection_formInfo[id].inputs.forEach(input => {
              if (keys2.includes(id + "_" + input.key)) {
                input.errorMsg = mapped2.find(e => e.formId + "_" + e.ctrlKey === id + "_" + input.key).message;
              } else {
                if (var0.includes(id + "_" + input.key))
                  input.errorMsg = undefined;
              }
            })
          })
          this.previousErrors = mapped2;
        } else {
          if (this.previousErrors.length > 0) {
            this.previousErrors.forEach(e => {
              fis.formGroupCollection_formInfo[e.formId].inputs.find(ee => ee.key === e.ctrlKey).errorMsg = undefined;
            })
          }
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
  public static appendFormIdErrorMapper(original: ErrorMessage[], cmpt: any) {
    return original.map(e => e.formId);
  }
}
import { FormInfoService } from "mt-form-builder";
import { FormGroup } from "@angular/forms";
import { IForm, IInputConfig } from 'mt-form-builder/lib/classes/template.interface';
import { ErrorMessage, IAggregateValidator, TValidatorContext } from './validation/validator-common';

export class ValidateHelper {
  private previousPayload: any;
  private _formInfo: IForm;
  private _formId: string;
  private _fis: FormInfoService
  constructor(formId: string, formInfo: any, fis: FormInfoService) {
    this._formInfo = formInfo;
    this._formId = formId;
    this._fis = fis;
  }
  updateErrorMsg(fg: FormGroup): void {
    this.previousPayload = fg.value;
    fg.valueChanges.subscribe(e => {
      const changedKey = this.findDelta(e);
      if (changedKey.length !== 0)
        this._formInfo.inputs.filter(e => changedKey.indexOf(e.key) > -1).forEach(input => this._fis.validateInput(this._formId, input));
      this.previousPayload = fg.value;
    });
  }
  valid(): boolean {
    this._formInfo.inputs.filter(e => e.display).forEach(input => this._fis.validateInput(this._formId, input));
    return this.noErrorPresent(this._formInfo.inputs);
  }
  private noErrorPresent(inputs: IInputConfig[]): boolean {
    return inputs.filter(e => e.display).find(input => input.errorMsg !== null && input.errorMsg !== undefined) === undefined
  }
  private findDelta(newPayload: any): string[] {
    const changeKeys: string[] = [];
    for (const p in newPayload) {
      // convert null, undefined, [] to null, treat them all same
      if (this.previousPayload[p] === '' || this.previousPayload[p] === null || this.previousPayload[p] === undefined || (Array.isArray(this.previousPayload[p]) && this.previousPayload[p].length === 0)) {
        this.previousPayload[p] = null;
      }
      if (newPayload[p] === '' || newPayload[p] === null || newPayload[p] === undefined || (Array.isArray(newPayload[p]) && newPayload[p].length === 0)) {
        newPayload[p] = null;
      }
      if (this.previousPayload[p] === newPayload[p] || JSON.stringify(this.previousPayload[p]) === JSON.stringify(newPayload[p])) {
      } else {
        changeKeys.push(p as string);
      }
    }
    return changeKeys;
  }
  public static checkThenPerform(validator: IAggregateValidator, getPayload: any,context:TValidatorContext, formgGroup: FormGroup, formInfo: IForm): boolean {
    let errors = validator.validate(getPayload(formgGroup),context);
    if (errors.length > 0) {
      let uniqueError: ErrorMessage[] = []
      errors.forEach(e => {
        if (uniqueError.some(ee => ee.ctrlKey === e.ctrlKey)) {
          //do nothing
        } else {
          uniqueError.push(e)
        }
      });
      uniqueError.forEach(e => {
        formInfo.inputs.find(ee => ee.key === e.ctrlKey).errorMsg = e.message;
      })
      console.dir('uniqueError')
      console.dir(uniqueError)
      formgGroup.valueChanges.subscribe(next => {
        let newErrors = validator.validate(getPayload(formgGroup),context)
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
          let keys = uniqueError2.map(e => e.ctrlKey);
          formInfo.inputs.forEach(input => {
            if (keys.includes(input.key)) {
              input.errorMsg = uniqueError2.find(e => e.ctrlKey === input.key).message;
            } else {
              input.errorMsg = undefined;
            }
          })
        } else {
          formInfo.inputs.forEach(e => e.errorMsg = undefined);
        }
      })
      return false
    } else {
      return true
    }
  }
}
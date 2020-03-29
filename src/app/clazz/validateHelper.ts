import { FormInfoService } from "mt-form-builder";
import { FormGroup } from "@angular/forms";
import { IForm } from 'mt-form-builder/lib/classes/template.interface';

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
  private noErrorPresent(inputs: any[]): boolean {
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
}
// import { IForm, IInputConfig } from "magic-form/lib/classes/template.interface";
// import { IForm } from 'magic-form/lib/classes/template.interface';
import { FormInfoService } from "magic-form";
import { FormGroup } from "@angular/forms";

export class ValidateHelper {
  private previousPayload: any;
  private _formInfo: any;
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
      this._formInfo.inputs.filter(input => input.key === changedKey).forEach(input => this._fis.validateInput(this._formId, input));
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
  private findDelta(newPayload: any): string {
    const changeKeys: string[] = [];
    for (const p in newPayload) {
      if (this.previousPayload[p] === newPayload[p]) {
      } else {
        changeKeys.push(p as string);
      }
    }
    return changeKeys[0];
  }
}
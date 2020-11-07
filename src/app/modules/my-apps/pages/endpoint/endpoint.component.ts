import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { ValidatorHelper } from 'src/app/clazz/validateHelper';
import { IEndpoint } from 'src/app/clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { EndpointValidator } from 'src/app/clazz/validation/aggregate/endpoint/validator-endpoint';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/endpoint.config';
import { EndpointService } from 'src/app/services/endpoint.service';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent implements OnInit, AfterViewInit, OnDestroy {
  formId = 'securityProfile';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  securityProfile: IEndpoint;
  productBottomSheet: IBottomSheet<IEndpoint>;
  private validateHelper = new ValidatorHelper();
  private validator = new EndpointValidator()
  private changeId = UUID()
  constructor(
    public endpointSvc: EndpointService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<EndpointComponent>
  ) {
    this.securityProfile = (data as IBottomSheet<IEndpoint>).from;
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  ngAfterViewInit(): void {
    if (this.securityProfile) {
      this.fis.restore(this.formId, this.securityProfile)
    }
    else {

    }
  }
  ngOnInit() {
  }
  convertToPayload(endpointCmpt: EndpointComponent): IEndpoint {
    let formGroup = endpointCmpt.fis.formGroupCollection[endpointCmpt.formId];
    return {
      id: formGroup.get('id').value,
      description: formGroup.get('description').value,
      resourceId: formGroup.get('resourceId').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
    }
  }
  doUpdate() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'UPDATE', this.fis, this, this.errorMapper))
      this.endpointSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(this), this.changeId)
  }
  doCreate() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'CREATE', this.fis, this, this.errorMapper))
      this.endpointSvc.create(this.convertToPayload(this), this.changeId)
  }
  errorMapper(original: ErrorMessage[], cmpt: EndpointComponent) {
    return original.map(e => {
      return {
        ...e,
        formId: cmpt.formId
      }
    })
  }
}

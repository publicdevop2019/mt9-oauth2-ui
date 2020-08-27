import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/security-profile.config';
import { EndpointService, IEndpoint } from 'src/app/services/endpoint.service';
import * as UUID from 'uuid/v1';
import { IBottomSheet } from 'src/app/clazz/summary.component';
@Component({
  selector: 'app-security-profile',
  templateUrl: './security-profile.component.html',
  styleUrls: ['./security-profile.component.css']
})
export class SecurityProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  formId = 'securityProfile';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  securityProfile: IEndpoint;
  validator: ValidateHelper;;
  productBottomSheet: IBottomSheet<IEndpoint>;
  constructor(
    public endpointSvc: EndpointService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<SecurityProfileComponent>
  ) {
    this.securityProfile = (data as IBottomSheet<IEndpoint>).from;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    if (this.securityProfile) {
      this.fis.restore(this.formId, this.securityProfile)
    }
    else {

    }
  }
  ngOnInit() {
  }
  convertToSecurityProfile(): IEndpoint {
    let formGroup = this.fis.formGroupCollection[this.formId];
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
    this.endpointSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToSecurityProfile(), UUID())
  }
  doCreate() {
    this.endpointSvc.create(this.convertToSecurityProfile(), UUID())
  }
}

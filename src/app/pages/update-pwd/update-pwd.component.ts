import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/update-pwd.config';
import { IResourceOwnerUpdatePwd } from 'src/app/modules/my-users/interface/resource-owner.interface';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-update-pwd',
  templateUrl: './update-pwd.component.html',
  styleUrls: ['./update-pwd.component.css']
})
export class UpdatePwdComponent implements OnInit, AfterViewInit, OnDestroy {
  formId = 'updatePwd';
  changeId=UUID();
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    public resourceOwnerService: ResourceOwnerService,
    private fis: FormInfoService,
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
  }
  ngOnDestroy(): void {
  }
  ngOnInit() {
  }
  convertToIResourceOwnerUpdatePwd(): IResourceOwnerUpdatePwd {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      password: formGroup.get('pwd').value,
      currentPwd: formGroup.get('currentPwd').value
    }
  }
  updatePwd(){
    this.resourceOwnerService.updateMyPwd(this.convertToIResourceOwnerUpdatePwd(),this.changeId)
  }
}

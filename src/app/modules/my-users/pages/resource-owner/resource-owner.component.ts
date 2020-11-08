import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { ValidatorHelper } from 'src/app/clazz/validateHelper';
import { IResourceOwner } from 'src/app/clazz/validation/aggregate/user/interfaze-user';
import { UserValidator } from 'src/app/clazz/validation/aggregate/user/validator-user';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/resource-owner.config';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-resource-owner',
  templateUrl: './resource-owner.component.html',
  styleUrls: ['./resource-owner.component.css']
})
export class ResourceOwnerComponent implements OnInit, AfterViewInit, OnDestroy {
  resourceOwner: IResourceOwner;
  formId = 'resourceOwner';
  private changeId = UUID()
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  productBottomSheet: IBottomSheet<IResourceOwner>;
  private userValidator = new UserValidator()
  private validateHelper = new ValidatorHelper()
  constructor(
    public resourceOwnerService: ResourceOwnerService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ResourceOwnerComponent>
  ) {
    this.resourceOwner = (data as IBottomSheet<IResourceOwner>).from;
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngAfterViewInit(): void {
    if (this.resourceOwner) {
      this.fis.formGroupCollection[this.formId].get('id').setValue(this.resourceOwner.id)
      this.fis.formGroupCollection[this.formId].get('email').setValue(this.resourceOwner.email)
      this.fis.formGroupCollection[this.formId].get('authority').setValue(this.resourceOwner.grantedAuthorities)
      this.fis.formGroupCollection[this.formId].get('locked').setValue(this.resourceOwner.locked)
      this.fis.formGroupCollection[this.formId].get('subNewOrder').setValue(this.resourceOwner.subscription)
    }
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  ngOnInit() {
  }

  convertToResourceOwner(cmpt: ResourceOwnerComponent): IResourceOwner {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    let authority: string[] = [];
    if (Array.isArray(formGroup.get('authority').value)) {
      authority = (formGroup.get('authority').value as Array<string>)
    }
    return {
      id: formGroup.get('id').value,//value is ignored
      locked: formGroup.get('locked').value,
      subscription: formGroup.get('subNewOrder').value,
      grantedAuthorities: authority
    }
  }
  doUpdate() {
    if (this.validateHelper.validate(this.userValidator, this.convertToResourceOwner, 'adminUpdateUserCommandValidator', this.fis, this, this.clientErrorMapper))
      this.resourceOwnerService.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToResourceOwner(this), this.changeId)
  }
  clientErrorMapper(original: ErrorMessage[], cmpt: ResourceOwnerComponent) {
    return original.map(e => {
      if (e.key === 'grantedAuthorities') {
        return {
          ...e,
          key: 'authority',
          formId: cmpt.formId
        }
      } else if (e.key === 'subscription') {
        return {
          ...e,
          key: 'subNewOrder',
          formId: cmpt.formId
        }
      } else {
        return {
          ...e,
          formId: cmpt.formId
        }
      }
    })
  }
}

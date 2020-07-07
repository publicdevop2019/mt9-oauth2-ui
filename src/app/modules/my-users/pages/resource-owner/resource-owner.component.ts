import { AfterViewInit, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/resource-owner.config';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { TranslateService } from '@ngx-translate/core';
import { IResourceOwner, IResourceOwnerUpdatePwd } from 'src/app/modules/my-users/pages/summary-resource-owner/summary-resource-owner.component';
import { IAuthority } from 'src/app/modules/my-apps/interface/client.interface';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
@Component({
  selector: 'app-resource-owner',
  templateUrl: './resource-owner.component.html',
  styleUrls: ['./resource-owner.component.css']
})
export class ResourceOwnerComponent implements OnInit, AfterViewInit, OnDestroy {
  resourceOwner: IResourceOwner;
  formId = 'resourceOwner';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    private route: ActivatedRoute,
    public resourceOwnerService: ResourceOwnerService,
    private fis: FormInfoService,
    public translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ResourceOwnerComponent>
  ) {
    this.resourceOwner = data as IResourceOwner;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    if (this.resourceOwner) {
      this.fis.formGroupCollection[this.formId].get('id').setValue(this.resourceOwner.id)
      this.fis.formGroupCollection[this.formId].get('email').setValue(this.resourceOwner.email)
      this.fis.formGroupCollection[this.formId].get('authority').setValue(this.resourceOwner.grantedAuthorities.map(e => e.grantedAuthority))
      this.fis.formGroupCollection[this.formId].get('locked').setValue(this.resourceOwner.locked)
      this.fis.formGroupCollection[this.formId].get('subNewOrder').setValue(this.resourceOwner.subscription)
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
    this.formInfo.inputs.forEach(e => {
      if (e.options) {
        e.options.forEach(el => {
          this.translate.get(el.label).subscribe((res: string) => {
            this.transKeyMap.set(e.key + el.value, el.label);
            el.label = res;
          });
        })
      }
      e.label && this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.forEach(e => {
        e.label && this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
        if (e.options) {
          e.options.forEach(el => {
            this.translate.get(this.transKeyMap.get(e.key + el.value)).subscribe((res: string) => {
              el.label = res;
            });
          })
        }
      })
    })
  }

  convertToResourceOwner(): IResourceOwner {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let authority: IAuthority[] = [];
    if (Array.isArray(formGroup.get('authority').value)) {
      authority = (formGroup.get('authority').value as Array<string>).map(e => {
        return <IAuthority>{
          grantedAuthority: e
        }
      })
    }
    return {
      id: formGroup.get('id').value,
      email: formGroup.get('email').value,
      locked: formGroup.get('locked').value,
      subscription: formGroup.get('subNewOrder').value,
      grantedAuthorities: authority
    }
  }
}

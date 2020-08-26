import { AfterViewInit, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/security-profile.config';
import { SecurityProfileService } from 'src/app/services/security-profile.service';
import { ISecurityProfile } from '../summary-security-profile/summary-security-profile.component';
import { TranslateService } from '@ngx-translate/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-security-profile',
  templateUrl: './security-profile.component.html',
  styleUrls: ['./security-profile.component.css']
})
export class SecurityProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  formId = 'securityProfile';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  securityProfile: ISecurityProfile;
  validator: ValidateHelper;;
  constructor(
    public securityProfileService: SecurityProfileService,
    private fis: FormInfoService,
    public translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<SecurityProfileComponent>
  ) {
    this.securityProfile = data as ISecurityProfile;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.fis.resetAll();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.formInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.filter(e => e.label).forEach(e => {
        this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
      })
    })
    if (this.securityProfile) {
      this.fis.restore(this.formId,this.securityProfile)
    }
    else {
  
    }
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
  }
  convertToSecurityProfile(): ISecurityProfile {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      resourceId: formGroup.get('resourceId').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
    }
  }
  doUpdate(){
    this.securityProfileService.update(this.convertToSecurityProfile(),UUID())
  }
  doCreate(){
    this.securityProfileService.create(this.convertToSecurityProfile(),UUID())
  }
}

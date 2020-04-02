import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IAttribute, IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/security-profile.config';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { ISecurityProfile } from '../summary-security-profile/summary-security-profile.component';

@Component({
  selector: 'app-security-profile',
  templateUrl: './security-profile.component.html',
  styleUrls: ['./security-profile.component.css']
})
export class SecurityProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  formId = 'securityProfile';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  securityProfile$: Observable<ISecurityProfile>;
  validator: ValidateHelper;;
  constructor(
    private route: ActivatedRoute,
    public securityProfileService: SecurityProfileService,
    private fis: FormInfoService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
  }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
  }
  ngOnInit() {
    this.securityProfile$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.securityProfileService.read(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.securityProfile$.subscribe(securityProfile => {
          this.fis.formGroupCollection[this.formId].get('id').setValue(securityProfile.id)
          this.fis.formGroupCollection[this.formId].get('resourceId').setValue(securityProfile.resourceId)
          this.fis.formGroupCollection[this.formId].get('lookupPath').setValue(securityProfile.lookupPath)
          this.fis.formGroupCollection[this.formId].get('method').setValue(securityProfile.method)
          this.fis.formGroupCollection[this.formId].get('expression').setValue(securityProfile.expression)
          if (securityProfile.scheme !== null || securityProfile.scheme !== undefined) {
            this.fis.formGroupCollection[this.formId].get('scheme').setValue(securityProfile.scheme)
            this.fis.formGroupCollection[this.formId].get('host').setValue(securityProfile.host)
            this.fis.formGroupCollection[this.formId].get('port').setValue(securityProfile.port)
            this.fis.formGroupCollection[this.formId].get('path').setValue(securityProfile.path)
          }
        })
      }
      else if (queryMaps.get('state') === 'none') {

      }
      else if (queryMaps.get('state') === 'create') {
      }
      else {

      }
    });
  }
  convertToSecurityProfile(): ISecurityProfile {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      resourceId: formGroup.get('resourceId').value,
      lookupPath: formGroup.get('lookupPath').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
      scheme: formGroup.get('scheme').value,
      host: formGroup.get('host').value,
      port: formGroup.get('port').value,
      path: formGroup.get('path').value,
    }
  }
}

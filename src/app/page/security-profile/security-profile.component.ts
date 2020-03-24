import { Component, OnInit, AfterContentInit, AfterViewChecked, AfterViewInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { ISecurityProfile } from '../summary-security-profile/summary-security-profile.component';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FORM_CONFIG } from 'src/app/form-configs/security-profile.config';
import { FormInfoService } from 'magic-form';
import { IForm, IInputConfig, IAttribute } from 'magic-form/lib/classes/template.interface';

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
  private previousPayload: any;
  constructor(
    private route: ActivatedRoute,
    public securityProfileService: SecurityProfileService,
    private fis: FormInfoService
  ) { }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
  }
  ngAfterViewInit(): void {
    this.previousPayload = this.fis.formGroupCollection[this.formId].value;
    this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
      const changedKey = this.findDelta(e);
      this.formInfo.inputs.filter(input => input.key === changedKey).forEach(input => this.fis.validateInput(this.formId, input));
      this.previousPayload = this.fis.formGroupCollection[this.formId].value;
    });
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
          this.fis.formGroupCollection[this.formId].get('resourceID').setValue(securityProfile.resourceID)
          this.fis.formGroupCollection[this.formId].get('path').setValue(securityProfile.path)
          this.fis.formGroupCollection[this.formId].get('method').setValue(securityProfile.method)
          this.fis.formGroupCollection[this.formId].get('expression').setValue(securityProfile.expression)
          if (securityProfile.url !== null || securityProfile.url !== undefined)
            this.fis.formGroupCollection[this.formId].get('url').setValue(securityProfile.url)
        })
      }
      else if (queryMaps.get('state') === 'none') {

      }
      else if (queryMaps.get('state') === 'create') {
        // url is required for create
        let attributes: IAttribute[] = [{ type: "required", errorMsg: "field cannot be empty" }];
        this.formInfo.inputs.find(e => e.key === 'url').attributes = attributes;
      }
      else {

      }
    });
  }
  convertToSecurityProfile(): ISecurityProfile {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      resourceID: formGroup.get('resourceID').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
      url: formGroup.get('url').value
    }
  }
  findDelta(newPayload: any): string {
    const changeKeys: string[] = [];
    for (const p in newPayload) {
      if (this.previousPayload[p] === newPayload[p]) {
      } else {
        changeKeys.push(p as string);
      }
    }
    return changeKeys[0];
  }
  validate(context: string): boolean {
    if (context.toLowerCase() === 'create') {
      this.formInfo.inputs.forEach(input => this.fis.validateInput(this.formId, input));
      return this.noErrorPresent(this.formInfo.inputs);
    }
    else if (context.toLowerCase() === 'update') {
      this.formInfo.inputs.forEach(input => this.fis.validateInput(this.formId, input));
      return this.noErrorPresent(this.formInfo.inputs);
    }
    else if (context.toLowerCase() === 'delete') {
      this.formInfo.inputs.forEach(input => this.fis.validateInput(this.formId, input));
      return this.noErrorPresent(this.formInfo.inputs);
    }
  }
  private noErrorPresent(inputs: IInputConfig[]): boolean {
    return inputs.find(input => input.errorMsg !== null && input.errorMsg !== undefined) === undefined
  }
}

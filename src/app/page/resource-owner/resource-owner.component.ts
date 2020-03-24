import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'magic-form';
import { IForm } from 'magic-form/lib/classes/template.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/resource-owner.config';
import { ResourceOwnerService } from 'src/app/service/resource-owner.service';
import { IAuthority } from '../summary-client/summary-client.component';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../summary-resource-owner/summary-resource-owner.component';
@Component({
  selector: 'app-resource-owner',
  templateUrl: './resource-owner.component.html',
  styleUrls: ['./resource-owner.component.css']
})
export class ResourceOwnerComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  resourceOwner: IResourceOwner;
  resourceOwner$: Observable<IResourceOwner>;
  hide = true;
  hide2 = true;
  formId = 'resourceOwner';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;;
  constructor(
    private route: ActivatedRoute,
    public resourceOwnerService: ResourceOwnerService,
    private fis: FormInfoService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
  }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
  }
  ngOnInit() {
    this.resourceOwner$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => this.resourceOwnerService.getResourceOwner(+params.get('id'))));
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update:authority') {
        this.resourceOwner$.subscribe(resourceOwner => {
          console.dir(resourceOwner)
          console.dir(resourceOwner.grantedAuthorities.map(e => e.grantedAuthority))
          this.fis.formGroupCollection[this.formId].get('id').setValue(resourceOwner.id)
          this.fis.formGroupCollection[this.formId].get('email').setValue(resourceOwner.email)
          this.fis.formGroupCollection[this.formId].get('authority').setValue(resourceOwner.grantedAuthorities.map(e => e.grantedAuthority))
          this.fis.formGroupCollection[this.formId].get('locked').setValue(resourceOwner.locked)
          this.fis.formGroupCollection[this.formId].get('subNewOrder').setValue(resourceOwner.subscription)
        })
      } else if (queryMaps.get('state') === 'update:pwd') {
        let ctrls = ['currentPwd', 'pwd', 'confirmPwd'];
        this.formInfo.inputs.forEach(e => e.display = ctrls.indexOf(e.key) > -1);
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
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
      password: formGroup.get('pwd').value,
      locked: formGroup.get('locked').value,
      subscription: formGroup.get('subNewOrder').value,
      grantedAuthorities: authority
    }
  }
  convertToIResourceOwnerUpdatePwd(): IResourceOwnerUpdatePwd {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      password: formGroup.get('pwd').value,
      currentPwd: formGroup.get('currentPwd').value
    }
  }
}

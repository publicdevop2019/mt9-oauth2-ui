import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IResourceOwner } from '../summary-resource-owner/summary-resource-owner.component';
import { ResourceOwnerService } from 'src/app/service/resource-owner.service';
import { Observable } from 'rxjs';
import { IAuthority } from '../summary-client/summary-client.component';
import { HttpProxyService } from 'src/app/service/http-proxy.service';
@Component({
  selector: 'app-resource-owner',
  templateUrl: './resource-owner.component.html',
  styleUrls: ['./resource-owner.component.css']
})
export class ResourceOwnerComponent implements OnInit {
  state: string;
  resourceOwner: IResourceOwner;
  resourceOwner$: Observable<IResourceOwner>;
  hide = true;
  hide2 = true;
  resourceOwnerForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    authorityAdmin: new FormControl('', [
      Validators.required
    ]),
    authorityUser: new FormControl('', [
      Validators.required
    ]),
    locked: new FormControl(false, [
      Validators.required
    ]),
    pwd: new FormControl('', [
      Validators.required
    ]),
    confirmPwd: new FormControl('', [
      Validators.required
    ]),
  });
  constructor(
    private route: ActivatedRoute,
    public resourceOwnerService: ResourceOwnerService,
    private httpProxy: HttpProxyService
  ) {
  }

  ngOnInit() {
    this.resourceOwner$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.resourceOwnerService.getResourceOwner(+params.get('id')))

    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update:authority') {
        this.resourceOwner$.subscribe(resourceOwner => {
          this.resourceOwnerForm.get('id').setValue(resourceOwner.id)
          this.resourceOwnerForm.get('email').setValue(resourceOwner.email)
          this.resourceOwnerForm.get('authorityAdmin').setValue(resourceOwner.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_ADMIN'))
          this.resourceOwnerForm.get('authorityUser').setValue(resourceOwner.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_USER'))
          this.resourceOwnerForm.get('locked').setValue(resourceOwner.locked)
        })
      } else if (queryMaps.get('state') === 'update:pwd') {
        this.resourceOwnerForm.get('email').setValue(this.httpProxy.netImpl.authenticatedEmail)

      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }

  getErrorMessage() {
    return this.resourceOwnerForm.get('email').hasError('required') ? 'You must enter a value' :
      this.resourceOwnerForm.get('email').hasError('email') ? 'Not a valid email' :
        '';
  }
  convertToResourceOwner(formGroup: FormGroup): IResourceOwner {
    let authority: IAuthority[] = [];
    if (formGroup.get('authorityAdmin').value)
      authority.push({ grantedAuthority: "ROLE_ADMIN" } as IAuthority)
    if (formGroup.get('authorityUser').value)
      authority.push({ grantedAuthority: "ROLE_USER" } as IAuthority)
    return {
      id: formGroup.get('id').value,
      email: formGroup.get('email').value,
      password: formGroup.get('pwd').value,
      locked: formGroup.get('locked').value,
      grantedAuthorities: authority
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ISecurityProfile } from '../summary-security-profile/summary-security-profile.component';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-profile',
  templateUrl: './security-profile.component.html',
  styleUrls: ['./security-profile.component.css']
})
export class SecurityProfileComponent implements OnInit {
  state: string;
  securityProfile: ISecurityProfile;
  securityProfile$: Observable<ISecurityProfile>;
  securityProfileForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
    resourceID: new FormControl('', [
      Validators.required
    ]),
    path: new FormControl('', [
      Validators.required
    ]),
    method: new FormControl('', [
      Validators.required
    ]),
    expression: new FormControl('', [
      Validators.required
    ]),
    url: new FormControl(''),
  });
  constructor(
    private route: ActivatedRoute,
    public securityProfileService: SecurityProfileService,
  ) { }

  ngOnInit() {
    this.securityProfile$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.securityProfileService.read(+params.get('id')))

    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.securityProfile$.subscribe(securityProfile => {
          this.securityProfileForm.get('id').setValue(securityProfile.id)
          this.securityProfileForm.get('resourceID').setValue(securityProfile.resourceID)
          this.securityProfileForm.get('path').setValue(securityProfile.path)
          this.securityProfileForm.get('method').setValue(securityProfile.method)
          this.securityProfileForm.get('expression').setValue(securityProfile.expression)
          if (securityProfile.url !== null || securityProfile.url !== undefined)
            this.securityProfileForm.get('url').setValue(securityProfile.url)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }
  convertToSecurityProfile(formGroup: FormGroup): ISecurityProfile {
    return {
      id: formGroup.get('id').value,
      resourceID: formGroup.get('resourceID').value,
      path: formGroup.get('path').value,
      method: formGroup.get('method').value,
      expression: formGroup.get('expression').value,
      url: formGroup.get('url').value
    }
  }
}

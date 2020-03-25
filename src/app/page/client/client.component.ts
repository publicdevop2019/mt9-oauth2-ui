import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ClientService } from 'src/app/service/client.service';
import { IClient, grantTypeEnums, scopeEnums, IAuthority } from '../summary-client/summary-client.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { IForm } from 'magic-form/lib/classes/template.interface';
import { FORM_CONFIG } from 'src/app/form-configs/client.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FormInfoService } from 'magic-form';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, AfterViewInit, OnDestroy {
  hide = true;
  state: 'update' | 'create';
  disabled = false;
  disabled2 = false;
  client$: Observable<IClient>;
  resources: IClient[];
  formId = 'client'
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  private previousPayload: any = {};
  private previousFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  constructor(
    private route: ActivatedRoute,
    public clientService: ClientService,
    public dialog: MatDialog,
    private fis: FormInfoService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
    this.client$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.clientService.getClient(+params.get('id')))
    );
    this.clientService.getResourceClient().pipe(switchMap(resources => {
      this.resources = resources;
      /** add new ctrl, ctrl name is default to client-id */
      this.formInfo.inputs.find(e => e.key === 'resourceId').options = this.resources.map(e => e.clientId);
      this.formInfo = JSON.parse(JSON.stringify(this.formInfo))
      return this.route.queryParamMap
    })).subscribe(queryMaps => {
      this.state = queryMaps.get('state') as 'update' | 'create';
      if (queryMaps.get('state') === 'update') {
        this.client$.subscribe(client => {
          const grantType: string = client.grantTypeEnums.filter(e => e !== grantTypeEnums.refresh_token)[0];
          this.fis.formGroupCollection[this.formId].patchValue({
            id: client.id,
            clientId: client.clientId,
            hasSecret: client.hasSecret,
            clientSecret: client.hasSecret ? '*****' : '',
            grantType: grantType,
            registeredRedirectUri: client.registeredRedirectUri ? client.registeredRedirectUri.join(',') : '',
            refreshToken: grantType === 'password' ? client.grantTypeEnums.some(e => e === grantTypeEnums.refresh_token) : false,
            resourceIndicator: client.resourceIndicator,
            autoApprove: client.autoApprove,
            authority: client.grantedAuthorities.map(e => e.grantedAuthority),
            scope: client.scopeEnums.map(e => e.toString()),
            accessTokenValiditySeconds: client.accessTokenValiditySeconds,
            refreshTokenValiditySeconds: client.refreshTokenValiditySeconds,
          });
          /** prefill dynamic resource-id inputs */
          if (this.resources)
            this.fis.formGroupCollection[this.formId].get('resourceId').setValue(client.resourceIds)
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }

  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
      // prevent infinite loop
      if (this.findDelta(e) !== undefined) {
        // clear form value on display = false
        this.formInfo.inputs.find(e => e.key === 'clientSecret').display = e['hasSecret'];
        this.formInfo.inputs.find(e => e.key === 'registeredRedirectUri').display = (e['grantType'] as string[] || []).indexOf('authorization_code') > -1;
        this.formInfo.inputs.find(e => e.key === 'refreshToken').display = (e['grantType'] as string[] || []).indexOf('password') > -1;
        this.formInfo.inputs.find(e => e.key === 'autoApprove').display = (e['grantType'] as string[] || []).indexOf('authorization_code') > -1;
        this.formInfo.inputs.find(e => e.key === 'refreshTokenValiditySeconds').display = (e['grantType'] as string[] || []).indexOf('password') > -1 && e['refreshToken'];
        if (this.updateViewRequired(this.previousFormInfo, this.formInfo)) {
          this.formInfo = JSON.parse(JSON.stringify(this.formInfo));
          this.previousFormInfo = JSON.parse(JSON.stringify(this.formInfo));
        }
      }
      this.previousPayload = e;
      // update form config
    })
  }
  private findDelta(newPayload: any): string {
    const changeKeys: string[] = [];
    for (const p in newPayload) {
      if (this.previousPayload[p] === newPayload[p] ||
        JSON.stringify(this.previousPayload[p]) === JSON.stringify(newPayload[p])) {
      } else {
        changeKeys.push(p as string);
      }
    }
    return changeKeys[0];
  }
  private updateViewRequired(previous: any, newPayload: any): boolean {
    return JSON.stringify(previous) !== JSON.stringify(newPayload);
  }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
  }
  ngOnInit() {
  }
  convertToClient(): IClient {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let grants: grantTypeEnums[] = [];
    let authority: IAuthority[] = [];
    let scopes: scopeEnums[] = [];
    grants.push(formGroup.get('grantType').value as grantTypeEnums);
    if (formGroup.get('refreshToken').value)
      grants.push(grantTypeEnums.refresh_token);

    if (formGroup.get('authority').value)
      authority = (formGroup.get('authority').value as string[]).map(e => { return { grantedAuthority: e } });

    if (formGroup.get('scope').value)
      scopes = (formGroup.get('scope').value as scopeEnums[]);

    return {
      id: formGroup.get('id').value,
      clientId: formGroup.get('clientId').value,
      hasSecret: formGroup.get('clientSecret').value ? true : false,
      clientSecret: formGroup.get('clientSecret').value == '*****' ? '' : formGroup.get('clientSecret').value,
      grantTypeEnums: grants,
      scopeEnums: scopes,
      grantedAuthorities: authority,
      accessTokenValiditySeconds: formGroup.get('accessTokenValiditySeconds').value as number,
      refreshTokenValiditySeconds: formGroup.get('refreshTokenValiditySeconds').value !== undefined && formGroup.get('refreshTokenValiditySeconds').value !== null && formGroup.get('refreshTokenValiditySeconds').value as number > 0
        ? formGroup.get('refreshTokenValiditySeconds').value as number : null,
      resourceIndicator: formGroup.get('resourceIndicator').value,
      resourceIds: formGroup.get('resourceId').value as string[],
      registeredRedirectUri: formGroup.get('registeredRedirectUri').value ? (formGroup.get('registeredRedirectUri').value as string).split(',') : null,
      autoApprove: formGroup.get('grantType').value === grantTypeEnums.authorization_code ? formGroup.get('autoApprove').value : null
    }
  }
}

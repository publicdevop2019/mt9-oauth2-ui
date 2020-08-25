import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/client.config';
import { ClientService } from 'src/app/services/client.service';
import { grantTypeEnums, IAuthority, IClient, scopeEnums } from '../../interface/client.interface';
import * as UUID from 'uuid/v1';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnDestroy, OnInit {
  hide = true;
  disabled = false;
  disabled2 = false;
  resources: IClient[];
  client: IClient;
  formId = 'client'
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  private formCreatedOb: Observable<string>;
  private previousPayload: any = {};
  private changeId = UUID()
  constructor(
    public clientService: ClientService,
    public dialog: MatDialog,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ClientComponent>,
  ) {
    this.client = data as IClient;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    combineLatest([this.formCreatedOb, this.clientService.getResourceClient()]).pipe(take(1)).subscribe(next => {
      this.resources = next[1].data;
      this.formInfo.inputs.find(e => e.key === 'resourceId').options = next[1].data.map(e => <IOption>{ label: e.clientId, value: e.clientId });
      this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
        // prevent infinite loop
        if (this.findDelta(e) !== undefined) {
          // clear form value on display = false
          this.formInfo.inputs.find(e => e.key === 'clientSecret').display = e['hasSecret'];
          this.formInfo.inputs.find(e => e.key === 'registeredRedirectUri').display = (e['grantType'] as string[] || []).indexOf('authorization_code') > -1;
          this.formInfo.inputs.find(e => e.key === 'refreshToken').display = (e['grantType'] as string[] || []).indexOf('password') > -1;
          this.formInfo.inputs.find(e => e.key === 'autoApprove').display = (e['grantType'] as string[] || []).indexOf('authorization_code') > -1;
          this.formInfo.inputs.find(e => e.key === 'refreshTokenValiditySeconds').display = (e['grantType'] as string[] || []).indexOf('password') > -1 && e['refreshToken'];
        }
        this.previousPayload = e;
        // update form config
      });
      if (this.client) {
        const grantType: string = this.client.grantTypeEnums.filter(e => e !== grantTypeEnums.refresh_token)[0];
        this.fis.formGroupCollection[this.formId].patchValue({
          id: this.client.id,
          clientId: this.client.clientId,
          hasSecret: this.client.hasSecret,
          clientSecret: this.client.hasSecret ? '*****' : '',
          grantType: grantType,
          registeredRedirectUri: this.client.registeredRedirectUri ? this.client.registeredRedirectUri.join(',') : '',
          refreshToken: grantType === 'password' ? this.client.grantTypeEnums.some(e => e === grantTypeEnums.refresh_token) : false,
          resourceIndicator: this.client.resourceIndicator,
          autoApprove: this.client.autoApprove,
          authority: this.client.grantedAuthorities.map(e => e.grantedAuthority),
          scope: this.client.scopeEnums.map(e => e.toString()),
          accessTokenValiditySeconds: this.client.accessTokenValiditySeconds,
          refreshTokenValiditySeconds: this.client.refreshTokenValiditySeconds,
          resourceId: this.client.resourceIds,
        });
      };
    })
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.fis.resetAll();
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
      description:formGroup.get('description').value,
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
  doUpdate(){
    this.clientService.updateClient(this.convertToClient(),this.changeId)
  }
  doCreate(){
    this.clientService.createClient(this.convertToClient(),this.changeId)
  }
}

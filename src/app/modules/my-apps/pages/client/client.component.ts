import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AbstractAggregate } from 'src/app/clazz/abstract-aggregate';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { grantTypeEnums, IClient, scopeEnums } from 'src/app/clazz/validation/aggregate/client/interfaze-client';
import { ClientValidator } from 'src/app/clazz/validation/aggregate/client/validator-client';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG } from 'src/app/form-configs/client.config';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent extends AbstractAggregate<ClientComponent, IClient> implements OnDestroy, OnInit {
  hide = true;
  disabled = false;
  disabled2 = false;
  resources: IClient[];
  private formCreatedOb: Observable<string>;
  private previousPayload: any = {};
  constructor(
    public clientService: ClientService,
    fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<ClientComponent>,
    cdr: ChangeDetectorRef
  ) {
    super('client', JSON.parse(JSON.stringify(FORM_CONFIG)), new ClientValidator(), bottomSheetRef, data, fis, cdr,true);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    combineLatest([this.formCreatedOb, this.clientService.readByQuery(0, 1000, 'resourceIndicator:1')]).pipe(take(1)).subscribe(next => {
      this.resources = next[1].data;
      this.formInfo.inputs.find(e => e.key === 'resourceId').options = next[1].data.map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.fis.formGroupCollection[this.formId].patchValue({ resourceId: [] }, { emitEvent: false })// keep to trigger checkbox change detect
      this.cdr.markForCheck();
      this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
        // prevent infinite loop
        if (this.findDelta(e) !== undefined) {
          // clear form value on display = false
          this.formInfo.inputs.find(e => e.key === 'clientSecret').display = e['hasSecret'];
          this.formInfo.inputs.find(e => e.key === 'registeredRedirectUri').display = (e['grantType'] as string[] || []).indexOf('AUTHORIZATION_CODE') > -1;
          this.formInfo.inputs.find(e => e.key === 'refreshToken').display = (e['grantType'] as string[] || []).indexOf('PASSWORD') > -1;
          this.formInfo.inputs.find(e => e.key === 'autoApprove').display = (e['grantType'] as string[] || []).indexOf('AUTHORIZATION_CODE') > -1;
          this.formInfo.inputs.find(e => e.key === 'refreshTokenValiditySeconds').display = (e['grantType'] as string[] || []).indexOf('PASSWORD') > -1 && e['refreshToken'];
        }
        this.previousPayload = e;
        // update form config
      });
      this.resumeFromEventStore();
      if (this.aggregate && this.eventStore.length === 0) {
        const grantType: string = this.aggregate.grantTypeEnums.filter(e => e !== grantTypeEnums.refresh_token)[0];
        this.fis.formGroupCollection[this.formId].patchValue({
          id: this.aggregate.id,
          hasSecret: this.aggregate.hasSecret,
          clientSecret: this.aggregate.hasSecret ? '*****' : '',
          name: this.aggregate.name,
          description: this.aggregate.description,
          grantType: grantType,
          registeredRedirectUri: this.aggregate.registeredRedirectUri ? this.aggregate.registeredRedirectUri.join(',') : '',
          refreshToken: grantType === 'PASSWORD' ? this.aggregate.grantTypeEnums.some(e => e === grantTypeEnums.refresh_token) : false,
          resourceIndicator: this.aggregate.resourceIndicator,
          autoApprove: this.aggregate.autoApprove,
          authority: this.aggregate.grantedAuthorities,
          scope: this.aggregate.scopeEnums.map(e => e.toString()),
          accessTokenValiditySeconds: this.aggregate.accessTokenValiditySeconds,
          refreshTokenValiditySeconds: this.aggregate.refreshTokenValiditySeconds,
          resourceId: this.aggregate.resourceIds,
        });
      };
    })
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  convertToPayload(clientCmpt: ClientComponent): IClient {
    let formGroup = clientCmpt.fis.formGroupCollection[clientCmpt.formId];
    let grants: grantTypeEnums[] = [];
    let authority: string[] = [];
    let scopes: scopeEnums[] = [];
    if (formGroup.get('grantType').value as grantTypeEnums) {
      grants.push(formGroup.get('grantType').value as grantTypeEnums);
    }
    if (formGroup.get('refreshToken').value)
      grants.push(grantTypeEnums.refresh_token);

    if (formGroup.get('authority').value)
      authority = (formGroup.get('authority').value as string[]);

    if (formGroup.get('scope').value)
      scopes = (formGroup.get('scope').value as scopeEnums[]);
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      hasSecret: formGroup.get('hasSecret').value ? true : false,
      clientSecret: formGroup.get('clientSecret').value == '*****' ? '' : formGroup.get('clientSecret').value,
      grantTypeEnums: grants,
      scopeEnums: scopes,
      grantedAuthorities: authority,
      accessTokenValiditySeconds: +formGroup.get('accessTokenValiditySeconds').value,
      refreshTokenValiditySeconds: formGroup.get('refreshTokenValiditySeconds').value !== undefined && formGroup.get('refreshTokenValiditySeconds').value !== null && formGroup.get('refreshTokenValiditySeconds').value as number > 0
        ? +formGroup.get('refreshTokenValiditySeconds').value : null,
      resourceIndicator: !!formGroup.get('resourceIndicator').value,
      resourceIds: formGroup.get('resourceId').value as string[],
      registeredRedirectUri: formGroup.get('registeredRedirectUri').value ? (formGroup.get('registeredRedirectUri').value as string).split(',') : null,
      autoApprove: formGroup.get('grantType').value === grantTypeEnums.authorization_code ? !!formGroup.get('autoApprove').value : null
    }
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootUpdateClientCommandValidator', this.fis, this, this.errorMapper))
      this.clientService.update(this.aggregate.id, this.convertToPayload(this), this.changeId, this.eventStore,this.version)
  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'rootCreateClientCommandValidator', this.fis, this, this.errorMapper))
      this.clientService.create(this.convertToPayload(this), this.changeId, this.eventStore)
  }
  errorMapper(original: ErrorMessage[], cmpt: ClientComponent) {
    return original.map(e => {
      if (e.key === 'resourceIds') {
        return {
          ...e,
          key: 'resourceId',
          formId: cmpt.formId
        }
      } else if (e.key === 'grantedAuthorities') {
        return {
          ...e,
          key: 'authority',
          formId: cmpt.formId
        }
      } else if (e.key === 'scopeEnums') {
        return {
          ...e,
          key: 'scope',
          formId: cmpt.formId
        }
      } else if (e.key === 'grantTypeEnums') {
        return {
          ...e,
          key: 'grantType',
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
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ClientService } from 'src/app/service/client.service';
import { IClient, grantTypeEnums, scopeEnums, IAuthority } from '../summary-client/summary-client.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  hide = true;
  state: 'update' | 'create';
  disabled = false;
  disabled2 = false;
  client$: Observable<IClient>;
  resources: IClient[];
  constructor(
    private route: ActivatedRoute,
    public clientService: ClientService,
    public dialog: MatDialog
  ) {
    this.clientService.getResourceClient().subscribe(resources => {
      this.resources = resources;
      /** add new ctrl, ctrl name is default to client-id */
      this.resources.forEach(e => this.clientForm.addControl(e.clientId, new FormControl('', [Validators.required])))
    });
    this.client$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.clientService.getClient(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state') as 'update' | 'create';
      if (queryMaps.get('state') === 'update') {
        this.client$.subscribe(client => {
          if (client === null || client === undefined)
            throw new Error('unable to find target client');//replace with error handler
          /** prefill required client fileds */
          const grantType: string = client.grantTypeEnums.filter(e => e !== grantTypeEnums.refresh_token)[0];
          this.clientForm.patchValue({
            id: client.id,
            clientId: client.clientId,
            hasSecret: client.hasSecret,
            clientSecret: client.hasSecret ? '*****' : '',
            grantType: grantType,
            grantTypeOptional: grantType === 'password' ? client.grantTypeEnums.some(e => e === grantTypeEnums.refresh_token) : false,
            authorityFront: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_FRONTEND'),
            authorityBack: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_BACKEND'),
            authorityFirst: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_FIRST_PARTY'),
            authorityThird: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_THIRD_PARTY'),
            authorityTrust: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_TRUST'),
            authorityRoot: client.grantedAuthorities.some(e => e.grantedAuthority === 'ROLE_ROOT'),
            scopeRead: client.scopeEnums.some(e => e === scopeEnums.read),
            scopeWrite: client.scopeEnums.some(e => e === scopeEnums.write),
            scopeTrust: client.scopeEnums.some(e => e === scopeEnums.trust),
            accessTokenValiditySeconds: client.accessTokenValiditySeconds,
            refreshTokenValiditySeconds: client.refreshTokenValiditySeconds,
            resourceIndicator: client.resourceIndicator,
            /**@todo support multiple redirect url */
            /**oauth2-id is not required always added to use oauth2service */
            registeredRedirectUri: client.registeredRedirectUri ? client.registeredRedirectUri[0] : ''
          });
          /** prefill dynamic resource-id inputs */
          this.resources.filter(e => client.resourceIds.indexOf(e.clientId) > -1).forEach(e => {
            this.clientForm.get(e.clientId).setValue(true)
          });
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }
  clientForm = new FormGroup({
    id: new FormControl('', [
      Validators.required
    ]),
    clientId: new FormControl('', [
      Validators.required
    ]),
    hasSecret: new FormControl(false, [
      Validators.required
    ]),
    clientSecret: new FormControl('', [
      Validators.required
    ]),
    grantType: new FormControl('', [
      Validators.required,
    ]),
    grantTypeOptional: new FormControl('', [
      Validators.required,
    ]),
    authorityFront: new FormControl(false, [
      Validators.required,
    ]),
    authorityBack: new FormControl(false, [
      Validators.required,
    ]),
    authorityFirst: new FormControl(false, [
      Validators.required,
    ]),
    authorityThird: new FormControl(false, [
      Validators.required,
    ]),
    authorityTrust: new FormControl(false, [
      Validators.required,
    ]),
    authorityRoot: new FormControl(false, [
      Validators.required,
    ]),
    scopeRead: new FormControl(false, [
      Validators.required,
    ]),
    scopeWrite: new FormControl(false, [
      Validators.required,
    ]),
    scopeTrust: new FormControl(false, [
      Validators.required,
    ]),
    accessTokenValiditySeconds: new FormControl('', [
      Validators.required,
    ]),
    refreshTokenValiditySeconds: new FormControl('', [
      Validators.required,
    ]),
    resourceIds: new FormControl('', [
      Validators.required,
    ]),
    resourceIndicator: new FormControl(false, [
      Validators.required,
    ]),
    registeredRedirectUri: new FormControl('', [
      Validators.required,
    ]),
  });
  ngOnInit() {
  }
  convertToClient(formGroup: FormGroup): IClient {
    let grants: grantTypeEnums[] = [];
    let authority: IAuthority[] = [];
    let scopes: scopeEnums[] = [];
    grants.push(formGroup.get('grantType').value as grantTypeEnums);
    if (formGroup.get('grantTypeOptional').value)
      grants.push(grantTypeEnums.refresh_token);
    if (formGroup.get('authorityFront').value)
      authority.push({ grantedAuthority: "ROLE_FRONTEND" } as IAuthority)
    if (formGroup.get('authorityBack').value)
      authority.push({ grantedAuthority: "ROLE_BACKEND" } as IAuthority)
    if (formGroup.get('authorityFirst').value)
      authority.push({ grantedAuthority: "ROLE_FIRST_PARTY" } as IAuthority)
    if (formGroup.get('authorityThird').value)
      authority.push({ grantedAuthority: "ROLE_THIRD_PARTY" } as IAuthority)
    if (formGroup.get('authorityTrust').value)
      authority.push({ grantedAuthority: "ROLE_TRUST" } as IAuthority)
    if (formGroup.get('scopeRead').value)
      scopes.push(scopeEnums.read)
    if (formGroup.get('scopeWrite').value)
      scopes.push(scopeEnums.write)
    if (formGroup.get('scopeTrust').value)
      scopes.push(scopeEnums.trust)

    return {
      id: formGroup.get('id').value,
      clientId: formGroup.get('clientId').value,
      hasSecret: formGroup.get('clientSecret').value ? true : false,
      clientSecret: formGroup.get('clientSecret').value,
      grantTypeEnums: grants,
      scopeEnums: scopes,
      grantedAuthorities: authority,
      accessTokenValiditySeconds: formGroup.get('accessTokenValiditySeconds').value as number,
      refreshTokenValiditySeconds: formGroup.get('clientSecret').value as boolean ? formGroup.get('accessTokenValiditySeconds').value as number : undefined,
      resourceIndicator: formGroup.get('resourceIndicator').value,
      resourceIds: this.resources.filter(e => this.clientForm.get(e.clientId).value).map(e => e.clientId),
      registeredRedirectUri: [formGroup.get('registeredRedirectUri').value]
    }
  }
}

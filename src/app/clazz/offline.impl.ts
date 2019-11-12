import { INetworkService, ITokenResponse, IAuthorizeParty, IAuthorizeCode } from '../interfaze/commom.interface';

import { Observable, of } from 'rxjs';

import { delay } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IClient } from '../page/summary-client/summary-client.component';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { HttpClient } from '@angular/common/http';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';

export class SandboxImpl implements INetworkService {
    autoApprove(clientId: string): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    createSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    updateSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    deleteSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    getSecurityProfiles(): Observable<ISecurityProfile[]> {
        return this.http.get<ISecurityProfile[]>('./assets/mock-security-profile.json').pipe(delay(this.defaultDelay))
    }
    revokeClientToken(clientId: string): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    }
    revokeResourceOwnerToken(resourceOwnerName: string): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    }
    authenticatedEmail: string;;
    private defaultDelay: number = 0;
    http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }
    currentUserAuthInfo: ITokenResponse;
    authorize(authorizeParty: IAuthorizeParty): Observable<IAuthorizeCode> {
        return of({ authorize_code: 'dummyCode' } as IAuthorizeCode).pipe(delay(this.defaultDelay))
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwner): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    updateResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    deleteResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    createClient(client: IClient): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    updateClient(client: IClient): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    deleteClient(client: IClient): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    getClients(): Observable<IClient[]> {
        return this.http.get<IClient[]>('./assets/mock-clients.json').pipe(delay(this.defaultDelay))
    }
    getResourceOwners(): Observable<IResourceOwner[]> {
        return this.http.get<IResourceOwner[]>('./assets/mock-resource-owners.json').pipe(delay(this.defaultDelay))
    }
    refreshToken(): Observable<ITokenResponse> {
        const mockedToken = {
            access_token: 'mockTokenString',
            refresh_token: 'mockTokenString2'
        };
        return of(mockedToken).pipe(delay(this.defaultDelay))
    }
    login(fg: FormGroup): Observable<ITokenResponse> {
        const mockedToken = {
            access_token: 'mockTokenString',
            refresh_token: 'mockTokenString2'
        };
        return of(mockedToken).pipe(delay(this.defaultDelay));
    }
    register(fg: FormGroup): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay));
    }
}
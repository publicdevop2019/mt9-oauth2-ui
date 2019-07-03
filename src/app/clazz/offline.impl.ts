import { INetworkService, ITokenResponse, IAuthorizeParty, IAuthorizeCode } from '../interfaze/commom.interface';

import { Observable, of } from 'rxjs';

import { delay } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IClient } from '../page/summary-client/summary-client.component';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { HttpClient } from '@angular/common/http';

export class SandboxImpl implements INetworkService {
    authorizeParty: IAuthorizeParty;
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
        console.dir(client)
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
    refreshToken(): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    }
    login(fg: FormGroup): Observable<boolean> {
        if (fg.get('email').value
            &&
            fg.get('pwd').value
        ) {
            this.currentUserAuthInfo = {
                access_token: 'mockTokenString',
                refresh_token: 'mockTokenString2'
            };
            this.authenticatedEmail = 'mockUser';
            return of(true).pipe(delay(this.defaultDelay));
        } else {
            return of(false).pipe(delay(this.defaultDelay));
        }
    }
    register(fg: FormGroup): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay));
    }
}
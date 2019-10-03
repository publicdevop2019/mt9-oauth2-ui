import { INetworkService, ITokenResponse, IAuthorizeParty, IAuthorizeCode, IAutoApprove } from '../interfaze/commom.interface';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


import { FormGroup } from '@angular/forms';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IClient } from '../page/summary-client/summary-client.component';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';
import { switchMap } from 'rxjs/operators';

export class OnlineImpl implements INetworkService {
    authorizeParty: IAuthorizeParty;
    authenticatedEmail: string;
    set currentUserAuthInfo(token: ITokenResponse) {
        sessionStorage.setItem('jwt', JSON.stringify(token))
    };
    get currentUserAuthInfo(): ITokenResponse | undefined {
        if (typeof sessionStorage.getItem('jwt') === 'string' && sessionStorage.getItem('jwt') === 'undefined')
            return undefined;
        return <ITokenResponse>JSON.parse(sessionStorage.getItem('jwt'))
    }
    private _httpClient: HttpClient;
    // OAuth2 pwd flow
    constructor(httpClient: HttpClient) {
        this._httpClient = httpClient;
    }
    autoApprove(clientId: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.get<IAutoApprove>(environment.serverUri + environment.apiVersion + '/client/autoApprove?clientId=' + clientId).subscribe(next => {
                if (next.autoApprove)
                    e.next(true)
                e.next(false)
            });
        });
    };
    createSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + '/proxy/security/profile', securitypProfile).subscribe(next => {
                e.next(true)
            });
        });

    };
    updateSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + '/proxy/security/profile/' + securitypProfile.id, securitypProfile).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + '/proxy/security/profile/' + securitypProfile.id).subscribe(next => {
                e.next(true)
            });
        });

    };
    getSecurityProfiles(): Observable<ISecurityProfile[]> {
        return this._httpClient.get<ISecurityProfile[]>(environment.serverUri + '/proxy/security/profiles');
    };
    revokeResourceOwnerToken(resourceOwnerName: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/blacklist/resourceOwner', { "name": resourceOwnerName }).subscribe(next => {
                e.next(true)
            });
        });
    }
    revokeClientToken(clientId: string): Observable<boolean> {
        // const formData = new FormData();
        // formData.append('name', clientId);
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/blacklist/client', { "name": clientId }).subscribe(next => {
                e.next(true)
            });
        });
    }
    authorize(authorizeParty: IAuthorizeParty): Observable<IAuthorizeCode> {
        const formData = new FormData();
        formData.append('response_type', authorizeParty.response_type);
        formData.append('client_id', authorizeParty.client_id);
        formData.append('state', authorizeParty.state);
        formData.append('redirect_uri', authorizeParty.redirect_uri);
        return this._httpClient.post<IAuthorizeCode>(environment.serverUri + environment.apiVersion + '/authorize', formData);
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch<IResourceOwner>(environment.serverUri + environment.apiVersion + '/resourceOwner/pwd', resourceOwner).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put<IResourceOwner>(environment.serverUri + environment.apiVersion + '/resourceOwner/' + resourceOwner.id, resourceOwner).subscribe(next => {
                e.next(true)
            });
        });

    };
    deleteResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete<IResourceOwner>(environment.serverUri + environment.apiVersion + '/resourceOwner/' + resourceOwner.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    createClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + environment.apiVersion + '/client', client).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + environment.apiVersion + '/client/' + client.id, client).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + environment.apiVersion + '/client/' + client.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    getResourceOwners(): Observable<IResourceOwner[]> {
        return this._httpClient.get<IResourceOwner[]>(environment.serverUri + environment.apiVersion + '/resourceOwners');
    };
    getClients(): Observable<IClient[]> {
        return this._httpClient.get<IClient[]>(environment.serverUri + environment.apiVersion + '/clients');
    };
    refreshToken(): Observable<ITokenResponse> {
        const formData = new FormData();
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', this.currentUserAuthInfo.refresh_token);
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) })
    }
    login(loginFG: FormGroup): Observable<ITokenResponse> {
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', loginFG.get('email').value);
        formData.append('password', loginFG.get('pwd').value);
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) });
    }
    register(registerFG: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._createUser(this._getToken(token), registerFG)))
    }
    private _getAuthHeader(islogin: boolean, token?: string): HttpHeaders {
        return islogin ? new HttpHeaders().append('Authorization',
            'Basic ' + btoa(environment.loginClientId + ':' + environment.clientSecret)) :
            token ? new HttpHeaders().append('Authorization', 'Bearer ' + token) :
                new HttpHeaders().append('Authorization', 'Basic ' + btoa(environment.registerClientId + ':' + environment.clientSecret));
    }
    private _getToken(res: ITokenResponse): string {
        return res.access_token;
    }
    private _createUser(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + environment.apiVersion + '/resourceOwner', this._getRegPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _getRegPayload(fg: FormGroup): IResourceOwner {
        return {
            email: fg.get('email').value,
            password: fg.get('pwd').value,
            grantedAuthorities: [],
            locked: false
        };
    }
}
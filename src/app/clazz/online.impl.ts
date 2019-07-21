import { INetworkService, ITokenResponse, IAuthorizeParty, IAuthorizeCode } from '../interfaze/commom.interface';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


import { FormGroup } from '@angular/forms';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IClient } from '../page/summary-client/summary-client.component';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';

export class OnlineImpl implements INetworkService {
    authorizeParty: IAuthorizeParty;
    authenticatedEmail: string;
    currentUserAuthInfo: ITokenResponse;
    private _httpClient: HttpClient;
    // OAuth2 pwd flow
    constructor(httpClient: HttpClient) {
        this._httpClient = httpClient;
    }
    createSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + environment.serverPort + '/proxy/security/profile', securitypProfile).subscribe(next => {
                e.next(true)
            });
        });

    };
    updateSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + environment.serverPort + '/proxy/security/profile/' + securitypProfile.id, securitypProfile).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + environment.serverPort + '/proxy/security/profile/' + securitypProfile.id).subscribe(next => {
                e.next(true)
            });
        });

    };
    getSecurityProfiles(): Observable<ISecurityProfile[]> {
        return this._httpClient.get<ISecurityProfile[]>(environment.serverUri + environment.serverPort + '/proxy/security/profiles');
    };
    revokeResourceOwnerToken(resourceOwnerName: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + environment.serverPort + '/proxy/blacklist/resourceOwner', { "name": resourceOwnerName }).subscribe(next => {
                e.next(true)
            });
        });
    }
    revokeClientToken(clientId: string): Observable<boolean> {
        // const formData = new FormData();
        // formData.append('name', clientId);
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + environment.serverPort + '/proxy/blacklist/client', { "name": clientId }).subscribe(next => {
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
        return this._httpClient.post<IAuthorizeCode>(environment.serverUri + environment.serverPort + environment.apiVersion + '/authorize', formData);
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch<IResourceOwner>(environment.serverUri + environment.serverPort + environment.apiVersion + '/resourceOwner/pwd', resourceOwner).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put<IResourceOwner>(environment.serverUri + environment.serverPort + environment.apiVersion + '/resourceOwner/' + resourceOwner.id, resourceOwner).subscribe(next => {
                e.next(true)
            });
        });

    };
    deleteResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete<IResourceOwner>(environment.serverUri + environment.serverPort + environment.apiVersion + '/resourceOwner/' + resourceOwner.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    createClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + environment.serverPort + environment.apiVersion + '/client', client).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + environment.serverPort + environment.apiVersion + '/client/' + client.id, client).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + environment.serverPort + environment.apiVersion + '/client/' + client.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    getResourceOwners(): Observable<IResourceOwner[]> {
        return this._httpClient.get<IResourceOwner[]>(environment.serverUri + environment.serverPort + environment.apiVersion + '/resourceOwners');
    };
    getClients(): Observable<IClient[]> {
        return this._httpClient.get<IClient[]>(environment.serverUri + environment.serverPort + environment.apiVersion + '/clients');
    };
    refreshToken(): Observable<boolean> {
        const formData = new FormData();
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', this.currentUserAuthInfo.refresh_token);
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) }).subscribe(next => {
                this.currentUserAuthInfo = next as ITokenResponse;
                e.next(true);
            },
                error => {
                    e.next(false);
                }
            );
        }
        );
    }
    login(loginFG: FormGroup): Observable<boolean> {
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', loginFG.get('email').value);
        formData.append('password', loginFG.get('pwd').value);
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) }).subscribe(next => {
                this.currentUserAuthInfo = next as ITokenResponse;
                this.authenticatedEmail = loginFG.get('email').value;
                e.next(true);
            },
                error => {
                    e.next(false);
                },
                () => {
                }
            );
        }
        );
    }
    register(registerFG: FormGroup): Observable<boolean> {
        return new Observable<boolean>(e => {
            const formData = new FormData();
            formData.append('grant_type', 'client_credentials');
            this._httpClient.post<ITokenResponse>(environment.tokenUrl,
                formData, { headers: this._getAuthHeader(false) }).subscribe(tokenResp => {
                    this._createUser(this._getToken(tokenResp), registerFG).subscribe(
                        status => {
                            if (status) {
                                e.next(true);
                            } else {
                                e.next(false);
                            }
                        },
                        error => {

                        },
                        () => {

                        }
                    );

                },
                    error => {

                    },
                    () => {

                    });
        });
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
    private _createUser(token: string, registerFG: FormGroup): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + environment.serverPort + environment.apiVersion + '/resourceOwner',
                this._getRegPayload(registerFG), { headers: this._getAuthHeader(false, token) }).subscribe(next => {
                    e.next(true);
                },
                    error => {
                        // NOTE:take care account already exist
                        // console.dir(error)
                        e.next(false);
                    },

                    () => {

                    });
        });
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
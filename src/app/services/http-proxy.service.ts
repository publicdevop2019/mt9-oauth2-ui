import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as UUID from 'uuid/v1';
import { ISumRep } from '../clazz/summary.component';
import { getCookie, hasValue } from '../clazz/utility';
import { IEditEvent } from '../components/editable-field/editable-field.component';
import { IAuthorizeCode, IAuthorizeParty, IAutoApprove, IOrder, ITokenResponse } from '../interfaze/commom.interface';
import { IForgetPasswordRequest, IPendingResourceOwner, IResourceOwnerUpdatePwd } from '../modules/my-users/interface/resource-owner.interface';
import { ICommentSummary } from './comment.service';
import { IPostSummary } from './post.service';
import { IUserReactionResult } from './reaction.service';
export interface IPatch {
    op: string,
    path: string,
    value?: string,
}
@Injectable({
    providedIn: 'root'
})
export class HttpProxyService {
    inProgress = false;
    refreshInprogress = false;
    private AUTH_SVC_NAME = '/auth-svc';
    private PRODUCT_SVC_NAME = '/product-svc';
    private PROFILE_SVC_NAME = '/profile-svc';
    private FILE_UPLOAD_SVC_NAME = '/file-upload-svc';
    private BBS_SVC_NAME = '/bbs-svc';
    set currentUserAuthInfo(token: ITokenResponse) {
        document.cookie = token === undefined ? 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/' : 'jwt=' + JSON.stringify(token) + ';path=/';
    };
    get currentUserAuthInfo(): ITokenResponse | undefined {
        const jwtTokenStr: string = getCookie('jwt');
        if (jwtTokenStr !== 'undefined' && jwtTokenStr !== undefined) {
            return <ITokenResponse>JSON.parse(jwtTokenStr)
        } else {
            return undefined;
        }
    }
    // OAuth2 pwd flow
    constructor(private _httpClient: HttpClient) {
    }
    deletePost(id: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.BBS_SVC_NAME + '/admin/posts/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteComment(id: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.BBS_SVC_NAME + '/admin/comments/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    rankLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/likes?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=DESC');
    };
    rankDisLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/dislikes?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=DESC');
    };
    rankReports(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/reports?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=DESC');
    };
    rankNotInterested(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/notInterested?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=DESC');
    };
    getAllComments(pageNum: number, pageSize: number): Observable<ICommentSummary> {
        return this._httpClient.get<ICommentSummary>(environment.serverUri + this.BBS_SVC_NAME + '/admin/comments?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortBy=id' + '&sortOrder=asc');
    };
    getAllPosts(pageNum: number, pageSize: number): Observable<IPostSummary> {
        return this._httpClient.get<IPostSummary>(environment.serverUri + this.BBS_SVC_NAME + '/admin/posts?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortBy=id' + '&sortOrder=asc');
    };
    getOrders(): Observable<IOrder[]> {
        return this._httpClient.get<IOrder[]>(environment.serverUri + this.PROFILE_SVC_NAME + '/orders');
    };
    uploadFile(file: File): Observable<string> {
        return new Observable<string>(e => {
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            this._httpClient.post<void>(environment.serverUri + this.FILE_UPLOAD_SVC_NAME + '/files', formData, { observe: 'response' }).subscribe(next => {
                e.next(next.headers.get('location'));
            });
        })
    };
    updateProductStatus(id: number, status: 'AVAILABLE' | 'UNAVAILABLE', changeId: string) {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('Content-Type', 'application/json-patch+json')
        headerConfig = headerConfig.set('changeId', changeId)
        return new Observable<boolean>(e => {
            this._httpClient.patch(environment.serverUri + this.PRODUCT_SVC_NAME + '/products/admin/' + id, this.getTimeValuePatch(status), { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    }
    batchUpdateProductStatus(ids: number[], status: 'AVAILABLE' | 'UNAVAILABLE', changeId: string) {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', changeId)
        return new Observable<boolean>(e => {
            this._httpClient.patch(environment.serverUri + this.PRODUCT_SVC_NAME + '/products/admin', this.getTimeValuePatch(status, ids), { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    }
    forgetPwd(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._forgetPwd(this._getToken(token), fg)))
    };
    resetPwd(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._resetPwd(this._getToken(token), fg)))
    };
    activate(fg: FormGroup, changeId: string): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        let headers = this._getAuthHeader(false);
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: headers }).pipe(switchMap(token => this._getActivationCode(this._getToken(token), fg, changeId)))
    };
    autoApprove(clientId: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.get<IAutoApprove>(environment.serverUri + this.AUTH_SVC_NAME + '/clients/user?query=clientId:' + clientId).subscribe(next => {
                if (next.data[0].autoApprove)
                    e.next(true)
                e.next(false)
            });
        });
    };
    revokeResourceOwnerToken(id: number): Observable<boolean> {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', UUID())
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/revoke-tokens/root', { "id": id, "type": "User" }, { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    }
    revokeClientToken(clientId: number): Observable<boolean> {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', UUID())
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/revoke-tokens/root', { "id": clientId, "type": "Client" }, { headers: headerConfig }).subscribe(next => {
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
        return this._httpClient.post<IAuthorizeCode>(environment.serverUri + this.AUTH_SVC_NAME + '/authorize', formData);
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd, changeId: string): Observable<boolean> {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', changeId)
        return new Observable<boolean>(e => {
            this._httpClient.put<IResourceOwnerUpdatePwd>(environment.serverUri + this.AUTH_SVC_NAME + '/users/user/pwd', resourceOwner, { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
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
    register(registerFG: FormGroup, changeId: string): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._createUser(this._getToken(token), registerFG, changeId)))
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
    private _createUser(token: string, registerFG: FormGroup, changeId: string): Observable<any> {
        let headers = this._getAuthHeader(false, token);
        headers = headers.append("changeId", changeId)
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/users/public', this._getRegPayload(registerFG), { headers: headers })
    }
    private _getActivationCode(token: string, registerFG: FormGroup, changeId: string): Observable<any> {
        let headers = this._getAuthHeader(false, token);
        headers = headers.append("changeId", changeId)
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/pending-users/public', this._getActivatePayload(registerFG), { headers: headers })
    }
    private _resetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/users/public/resetPwd', this._getResetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _forgetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/users/public/forgetPwd', this._getForgetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _getRegPayload(fg: FormGroup): IPendingResourceOwner {
        return {
            email: fg.get('email').value,
            password: fg.get('pwd').value,
            activationCode: fg.get('activationCode').value,
        };
    }
    private _getActivatePayload(fg: FormGroup): IPendingResourceOwner {
        return {
            email: fg.get('email').value,
        };
    }
    private _getForgetPayload(fg: FormGroup): IForgetPasswordRequest {
        return {
            email: fg.get('email').value,
        };
    }
    private _getResetPayload(fg: FormGroup): IForgetPasswordRequest {
        return {
            email: fg.get('email').value,
            token: fg.get('token').value,
            newPassword: fg.get('pwd').value,
        };
    }
    private getPageParam(pageNumer?: number, pageSize?: number, sortBy?: string, sortOrder?: string): string {
        let var1: string[] = [];
        if (hasValue(pageNumer) && hasValue(pageSize)) {
            if (sortBy && sortOrder) {
                var1.push('num:' + pageNumer)
                var1.push('size:' + pageSize)
                var1.push('by:' + sortBy)
                var1.push('order:' + sortOrder)
                return "page=" + var1.join(',')
            } else {
                var1.push('num:' + pageNumer)
                var1.push('size:' + pageSize)
                return "page=" + var1.join(',')
            }
        }
        return ''
    }
    private getQueryParam(params: string[]): string {
        params = params.filter(e => (e !== '') && (e !== null) && (e !== undefined))
        if (params.length > 0)
            return "?" + params.join('&')
        return ""
    }
    private getTimeValuePatch(status: 'AVAILABLE' | 'UNAVAILABLE', ids?: number[]): IPatch[] {
        let re: IPatch[] = [];
        if (ids && ids.length > 0) {
            ids.forEach(id => {
                if (status === "AVAILABLE") {
                    let startAt = <IPatch>{ op: 'add', path: "/" + id + '/startAt', value: String(Date.now()) }
                    let endAt = <IPatch>{ op: 'add', path: "/" + id + '/endAt' }
                    re.push(startAt, endAt)
                } else {
                    let startAt = <IPatch>{ op: 'add', path: "/" + id + '/startAt' }
                    re.push(startAt)
                }
            })
        } else {
            if (status === "AVAILABLE") {
                let startAt = <IPatch>{ op: 'add', path: '/startAt', value: String(Date.now()) }
                let endAt = <IPatch>{ op: 'add', path: '/endAt' }
                re.push(startAt, endAt)
            } else {
                let startAt = <IPatch>{ op: 'add', path: '/startAt' }
                re.push(startAt)
            }
        }
        return re;
    }
    private getPatchPayload(fieldName: string, fieldValue: IEditEvent): IPatch[] {
        let re: IPatch[] = [];
        let type = undefined;
        if (fieldValue.original) {
            type = 'replace'
        } else {
            type = 'add'
        }
        let startAt = <IPatch>{ op: type, path: "/" + fieldName, value: fieldValue.next }
        re.push(startAt)
        return re;
    }
    createEntity(entityRepo: string, role: string, entity: any, changeId: string): Observable<boolean> {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', changeId)
        return new Observable<boolean>(e => {
            this._httpClient.post(entityRepo + '/' + role, entity, { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    };
    readEntityById<S>(entityRepo: string, role: string, id: number): Observable<S> {
        return this._httpClient.get<S>(entityRepo + '/' + role + '/' + id);
    };
    readEntityByQuery<T>(entityRepo: string, role: string, num: number, size: number, query?: string, by?: string, order?: string) {
        return this._httpClient.get<ISumRep<T>>(entityRepo + '/' + role + this.getQueryParam([query, this.getPageParam(num, size, by, order)]))
    };
    updateEntity(entityRepo: string, role: string, id: number, entity: any, changeId: string): Observable<boolean> {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('changeId', changeId)
        return new Observable<boolean>(e => {
            this._httpClient.put(entityRepo + '/' + role + '/' + id, entity, { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteEntityById(entityRepo: string, role: string, id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(entityRepo + '/' + role + '/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteEntityByQuery(entityRepo: string, role: string, query: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(entityRepo + '/' + role + '?' + query).subscribe(next => {
                e.next(true)
            });
        });
    };
    patchEntityById(entityRepo: string, role: string, id: number, fieldName: string, editEvent: IEditEvent, changeId: string) {
        let headerConfig = new HttpHeaders();
        headerConfig = headerConfig.set('Content-Type', 'application/json-patch+json')
        headerConfig = headerConfig.set('changeId', changeId);
        return new Observable<boolean>(e => {
            this._httpClient.patch(entityRepo + '/' + role + '/' + id, this.getPatchPayload(fieldName, editEvent), { headers: headerConfig }).subscribe(next => {
                e.next(true)
            });
        });
    }
}
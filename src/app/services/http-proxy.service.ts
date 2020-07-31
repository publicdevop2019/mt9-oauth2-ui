import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getCookie, hasValue } from '../clazz/utility';
import { IAuthorizeCode, IAuthorizeParty, IAutoApprove, IOrder, ITokenResponse } from '../interfaze/commom.interface';
import { IClient } from '../modules/my-apps/interface/client.interface';
import { ISecurityProfile } from '../modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { IForgetPasswordRequest, IPendingResourceOwner, IResourceOwner, IResourceOwnerUpdatePwd } from '../modules/my-users/interface/resource-owner.interface';
import { IBizAttribute, IAttributeHttp } from './attribute.service';
import { ICatalogCustomer, ICatalogCustomerHttp } from './catalog.service';
import { ICommentSummary } from './comment.service';
import { IPostSummary } from './post.service';
import { IProductDetail, IProductSimple, IProductTotalResponse } from './product.service';
import { IUserReactionResult } from './reaction.service';
import { IFilter, IFilterSummaryNet } from './filter.service';
/**
 * proxy http to enalbe offline mode and mocking
 */
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
    deleteAttribute(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/attributes/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateAttribute(attr: IBizAttribute): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/attributes/' + attr.id, attr).subscribe(next => {
                e.next(true)
            });
        });
    };
    createAttribute(attr: IBizAttribute): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/attributes', attr).subscribe(next => {
                e.next(true)
            });
        });
    };
    createFilter(filter: IFilter) {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/filters', filter).subscribe(next => {
                e.next(true)
            });
        });
    }
    readFilter(id: number) {
        return this._httpClient.get<IFilter>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/filters/' + id)
    }
    updateFilter(filter: IFilter) {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/filters/' + filter.id, filter).subscribe(next => {
                e.next(true)
            });
        });
    }
    deleteFilter(id: number) {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/filters/' + id).subscribe(next => {
                e.next(true)
            });
        });
    }
    getAllFilters(pageNum: number, pageSize: number, sortBy?: string, sortOrder?: string): Observable<IFilterSummaryNet> {
        return this._httpClient.get<IFilterSummaryNet>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/filters?' + this.getPageParam(pageNum, pageSize, sortBy, sortOrder))
    }
    getAttributes(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<IAttributeHttp> {
        return this._httpClient.get<IAttributeHttp>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/attributes?' + this.getPageParam(pageNum, pageSize, sortBy, sortOrder));
    }
    getAttributeById(id: number): Observable<IBizAttribute> {
        return this._httpClient.get<IBizAttribute>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/attributes/' + id);
    }
    searchProductByKeyword(pageNum: number, pageSize: number, keyword: string): Observable<IProductTotalResponse> {
        return this._httpClient.get<IProductTotalResponse>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails?pageNum=' + pageNum + '&pageSize=' + pageSize + '&key=' + keyword);
    }
    searchProductById(id: number): Observable<IProductTotalResponse> {
        return this._httpClient.get<IProductTotalResponse>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails?id=' + id);
    }
    searchProductsByTags(pageNum: number, pageSize: number, attr: string[]): Observable<IProductTotalResponse> {
        return this._httpClient.get<IProductTotalResponse>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails/search?pageNum=' + pageNum + '&pageSize=' + pageSize + '&attributes=' + attr.join(','));
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
    getAllProducts(pageNum: number, pageSize: number, sortBy?: string, sortOrder?: string): Observable<IProductTotalResponse> {
        return this._httpClient.get<IProductTotalResponse>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails?' + this.getPageParam(pageNum, pageSize, sortBy, sortOrder));
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
    getProducts(category: string, pageNum: number, pageSize: number): Observable<IProductSimple[]> {
        return this._httpClient.get<IProductSimple[]>(environment.serverUri + this.PRODUCT_SVC_NAME + '/catalogs/' + category + '?pageNum=' + pageNum + '&pageSize=' + pageSize);
    };
    getProductDetail(id: number): Observable<IProductDetail> {
        return this._httpClient.get<IProductDetail>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails/' + id);
    };
    createProduct(productDetail: IProductDetail): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails', productDetail).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteProduct(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateProduct(productDetail: IProductDetail): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails/' + productDetail.id, productDetail).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateProductStatus(id: number, status: 'AVAILABLE' | 'UNAVAILABLE') {
        return new Observable<boolean>(e => {
            const formData = new FormData();
            formData.append('status', String(status));
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/productDetails/' + id + '/status', formData).subscribe(next => {
                e.next(true)
            });
        });
    }
    batchUpdateSecurityProfile(securitypProfile: { [key: string]: string }): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch(environment.serverUri + '/proxy/security/profile/batch/url', securitypProfile).subscribe(next => {
                e.next(true)
            });
        });
    };
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
    activate(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._getActivationCode(this._getToken(token), fg)))
    };
    getCatalogFrontendAdmin(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<ICatalogCustomerHttp> {
        return this._httpClient.get<ICatalogCustomerHttp>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/frontend/catalogs?' + this.getPageParam(pageNum, pageSize, sortBy, sortOrder));
    };
    getCatalogBackendAdmin(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<ICatalogCustomerHttp> {
        return this._httpClient.get<ICatalogCustomerHttp>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/backend/catalogs?' + this.getPageParam(pageNum, pageSize, sortBy, sortOrder));
    };
    getCatalogByIdAdmin(id: number): Observable<ICatalogCustomer> {
        return this._httpClient.get<ICatalogCustomer>(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/catalogs/' + id);
    };
    createCategory(category: ICatalogCustomer): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/catalogs', category).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteCategory(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/catalogs/' + id).subscribe(next => {
                e.next(true)
            });
        });

    };
    updateCategory(category: ICatalogCustomer): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/admin/catalogs/' + category.id, category).subscribe(next => {
                e.next(true)
            });
        });
    };
    autoApprove(clientId: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.get<IAutoApprove>(environment.serverUri + this.AUTH_SVC_NAME + '/clients/autoApprove?clientId=' + clientId).subscribe(next => {
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
    deleteSecurityProfile(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + '/proxy/security/profile/' + id).subscribe(next => {
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
        return this._httpClient.post<IAuthorizeCode>(environment.serverUri + this.AUTH_SVC_NAME + '/authorize', formData);
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch<IResourceOwnerUpdatePwd>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwner/pwd', resourceOwner).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put<IResourceOwner>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/' + resourceOwner.id, resourceOwner).subscribe(next => {
                e.next(true)
            });
        });

    };
    deleteResourceOwner(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete<IResourceOwner>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    createClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.AUTH_SVC_NAME + '/clients', client).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.AUTH_SVC_NAME + '/clients/' + client.id, client).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteClient(id: number): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.AUTH_SVC_NAME + '/clients/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    getResourceOwners(): Observable<IResourceOwner[]> {
        return this._httpClient.get<IResourceOwner[]>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners');
    };
    getClients(): Observable<IClient[]> {
        return this._httpClient.get<IClient[]>(environment.serverUri + this.AUTH_SVC_NAME + '/clients');
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
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners', this._getRegPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _getActivationCode(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/register', this._getActivatePayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _resetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/resetPwd', this._getResetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _forgetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/forgetPwd', this._getForgetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
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
                var1.push('pageNum=' + pageNumer)
                var1.push('pageSize=' + pageSize)
                var1.push('sortBy=' + sortBy)
                var1.push('sortOrder=' + sortOrder)
                return var1.join('&')
            } else {
                var1.push('pageNum=' + pageNumer)
                var1.push('pageSize=' + pageSize)
                return var1.join('&')
            }
        }
        return ''
    }
}

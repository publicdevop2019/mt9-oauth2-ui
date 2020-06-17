import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IAuthorizeCode, IAuthorizeParty, INetworkService, IOrder, ITokenResponse } from '../interfaze/commom.interface';
import { IClient } from '../pages/summary-client/summary-client.component';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../pages/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../pages/summary-security-profile/summary-security-profile.component';
import { ICategory, IAdminCategory } from '../services/category.service';
import { IProductDetail, IProductSimple, IProductTotalResponse } from '../services/product.service';
import { IPostCard, IPostSummary } from '../services/post.service';
import { IComment, ICommentSummary } from '../services/comment.service';
import { IUserReactionResult } from '../services/reaction.service';



export class SandboxImpl implements INetworkService {
    private defaultDelay: number = 0;
    http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }
    deletePost(id: string): Observable<boolean> {
        return of(true);
    };
    deleteComment(id: string): Observable<boolean> {
        return of(true);
    };
    rankLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return of({
            "results": [
                {
                    "count": 1,
                    "referenceId": "101",
                    "referenceType": "COMMENT"
                }
            ], total: 1
        });
    };
    rankDisLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return of({
            "results": [
                {
                    "count": 1,
                    "referenceId": "101",
                    "referenceType": "COMMENT"
                }
            ],
            total: 1
        });
    };
    rankReports(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return of({
            "results": [
                {
                    "count": 1,
                    "referenceId": "101",
                    "referenceType": "COMMENT"
                }
            ], total: 1
        });
    };
    rankNotInterested(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return of({
            "results": [
                {
                    "count": 1,
                    "referenceId": "101",
                    "referenceType": "COMMENT"
                }
            ], total: 1
        });
    };
    getOrders(): Observable<IOrder[]> {
        return this.http.get<IOrder[]>('./assets/mock-order.json').pipe(delay(this.defaultDelay))
    };
    uploadFile(file: File): Observable<string> {
        return of("mockString").pipe(delay(this.defaultDelay))
    };
    getProducts(category: string): Observable<IProductSimple[]> {
        return this.http.get<IProductSimple[]>('./assets/mock-product-simple.json').pipe(delay(this.defaultDelay))
    };
    getAllProducts(pageNum: number, pageSize: number): Observable<IProductTotalResponse> {
        return this.http.get<IProductTotalResponse>('./assets/mock-product-simple.json').pipe(delay(this.defaultDelay))
    };
    getProductDetail(id: number): Observable<import("../services/product.service").IProductDetail> {
        return this.http.get<IProductDetail>('./assets/mock-product-detail.json').pipe(delay(this.defaultDelay))

    };
    createProduct(productDetail: IProductDetail): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    deleteProduct(productDetail: IProductDetail): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    updateProduct(productDetail: IProductDetail): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    getCategories(): Observable<IAdminCategory> {
        return this.http.get<IAdminCategory>('./assets/mock-categories.json').pipe(delay(this.defaultDelay))
    };
    createCategory(category: ICategory): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    deleteCategory(category: ICategory): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
    updateCategory(category: ICategory): Observable<boolean> {
        return of(true).pipe(delay(this.defaultDelay))
    };
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
    getAllComments(pageNum: number, pageSize: number): Observable<ICommentSummary> {
        return of(<ICommentSummary>{ results: [], total: 0 })
    };
    getAllPosts(pageNum: number, pageSize: number): Observable<IPostSummary> {
        return of(<IPostSummary>{ results: [], total: 0 })
    };
    batchUpdateSecurityProfile(securitypProfile: { [key: string]: string }): Observable<boolean> {
        return of(true);
    };
    activate(fg: FormGroup): Observable<any> {
        return of()
    };
    resetPwd(fg: FormGroup): Observable<any> {
        return of()
    };
    forgetPwd(fg: FormGroup): Observable<any> {
        return of()
    };
    currentUserAuthInfo: ITokenResponse;
    authorize(authorizeParty: IAuthorizeParty): Observable<IAuthorizeCode> {
        return of({ authorize_code: 'dummyCode' } as IAuthorizeCode).pipe(delay(this.defaultDelay))
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd): Observable<boolean> {
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
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ISecurityProfile } from '../modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { ICatalogCustomerHttp, ICatalogCustomer } from '../services/catalog.service';
import { ICommentSummary } from '../services/comment.service';
import { IPostSummary } from '../services/post.service';
import { IProductDetail, IProductSimple, IProductTotalResponse } from '../services/product.service';
import { IUserReactionResult } from '../services/reaction.service';
import { IAttributeHttp, IBizAttribute } from '../services/attribute.service';
import { IClient } from '../modules/my-apps/interface/client.interface';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../modules/my-users/interface/resource-owner.interface';

// regulate interface
export interface INetworkService {
  deleteAttribute: (id: number) => Observable<boolean>;
  updateAttribute: (tag: IBizAttribute) => Observable<boolean>;
  createAttribute: (tag: IBizAttribute) => Observable<boolean>;
  getAttributes(): Observable<IAttributeHttp>;
  searchProductByKeyword(pageNum: number, pageSize: number, keyword: string): Observable<IProductTotalResponse>;
  searchProductById(id: number): Observable<IProductTotalResponse>;
  searchProductsByTags(pageNum: number, pageSize: number, tags: string[]): Observable<IProductTotalResponse>;
  currentUserAuthInfo: ITokenResponse;
  login: (fg: FormGroup) => Observable<ITokenResponse>;
  register: (fg: FormGroup) => Observable<any>;
  activate: (fg: FormGroup) => Observable<any>;
  forgetPwd: (fg: FormGroup) => Observable<any>;
  resetPwd: (fg: FormGroup) => Observable<any>;
  refreshToken: () => Observable<ITokenResponse>;
  uploadFile: (file: File) => Observable<string>;
  getAllPosts: (pageNum: number, pageSize: number) => Observable<IPostSummary>;
  getAllComments: (pageNum: number, pageSize: number) => Observable<ICommentSummary>;
  rankLikes: (pageNum: number, pageSize: number) => Observable<IUserReactionResult>;
  rankDisLikes: (pageNum: number, pageSize: number) => Observable<IUserReactionResult>;
  rankReports: (pageNum: number, pageSize: number) => Observable<IUserReactionResult>;
  rankNotInterested: (pageNum: number, pageSize: number) => Observable<IUserReactionResult>;
  deletePost: (id: string) => Observable<boolean>;
  deleteComment: (id: string) => Observable<boolean>;

  getOrders: () => Observable<IOrder[]>

  getCatalogFrontendAdmin: () => Observable<ICatalogCustomerHttp>;
  getCatalogBackendAdmin: () => Observable<ICatalogCustomerHttp>;
  createCategory: (category: ICatalogCustomer) => Observable<boolean>;
  deleteCategory: (id: number) => Observable<boolean>;
  updateCategory: (category: ICatalogCustomer) => Observable<boolean>;

  getAllProducts: (pageNum: number, pageSize: number) => Observable<IProductTotalResponse>;
  getProducts: (category: string, pageNum: number, pageSize: number) => Observable<IProductSimple[]>;
  getProductDetail: (id: number) => Observable<IProductDetail>;
  createProduct: (productDetail: IProductDetail) => Observable<boolean>;
  deleteProduct: (id: number) => Observable<boolean>;
  updateProduct: (productDetail: IProductDetail) => Observable<boolean>;

  getClients: () => Observable<IClient[]>;
  updateClient: (client: IClient) => Observable<boolean>;
  deleteClient: (id: number) => Observable<boolean>;
  createClient: (client: IClient) => Observable<boolean>;

  getResourceOwners: () => Observable<IResourceOwner[]>;
  updateResourceOwner: (resourceOwner: IResourceOwner) => Observable<boolean>;
  updateResourceOwnerPwd: (resourceOwner: IResourceOwnerUpdatePwd) => Observable<boolean>;
  deleteResourceOwner: (id: number) => Observable<boolean>;

  authorize: (authorizeParty: IAuthorizeParty) => Observable<IAuthorizeCode>;
  revokeClientToken: (clientId: string) => Observable<boolean>;
  revokeResourceOwnerToken: (resourceOwnerName: string) => Observable<boolean>;
  getSecurityProfiles: () => Observable<ISecurityProfile[]>;
  createSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
  updateSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
  batchUpdateSecurityProfile: (securitypProfile: { [key: string]: string }) => Observable<boolean>;
  deleteSecurityProfile: (id: number) => Observable<boolean>;
  autoApprove: (clientId: string) => Observable<boolean>;
}
export interface ITokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: string;
  scope?: string;
}
export interface IAuthorizeParty {
  response_type: string;
  client_id: string;
  state: string;
  redirect_uri: string;
}
export interface IAuthorizeCode {
  authorize_code: string;
}
export interface IAutoApprove {
  autoApprove: boolean;
}
export interface IOrder {
  id: string;
  productList: ICartItem[];
  address: IAddress;
  paymentType: string;
  paymentAmt: string;
  orderState: string;
}
export interface ICartItem {
  id: string;
  finalPrice: string;
  selectedOptions: IProductOptions[];
  imageUrlSmall: string;
  productId: string;
  name: string;
}
export interface IAddress {
  id: string;
  country: string;
  province: string;
  postalCode: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  phoneNumber: string;
}
export interface IPayment {
  id: string;
  type: string;
  accountNumber: string;
  accountHolderName: string;
  expireDate: string;
  cvv?: string;
}
export interface IProductOptions {
  title: string;
  options: IProductOption[];
}
export interface IProductOption {
  optionValue: string;
  priceVar?: string;
}
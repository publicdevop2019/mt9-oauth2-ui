import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IClient } from '../pages/summary-client/summary-client.component';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../pages/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../pages/summary-security-profile/summary-security-profile.component';
import { ICategory, IAdminCategory } from '../services/category.service';
import { IProductDetail, IProductSimple, IProductTotalResponse } from '../services/product.service';
import { IPostCard, IPostSummary } from '../services/post.service';
import { IComment, ICommentSummary } from '../services/comment.service';
import { IUserReactionResult } from '../services/reaction.service';

// regulate interface
export interface INetworkService {
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

  getCategories: () => Observable<IAdminCategory>;
  createCategory: (category: ICategory) => Observable<boolean>;
  deleteCategory: (category: ICategory) => Observable<boolean>;
  updateCategory: (category: ICategory) => Observable<boolean>;

  getAllProducts: (pageNum: number, pageSize: number) => Observable<IProductTotalResponse>;
  getProducts: (category: string, pageNum: number, pageSize: number) => Observable<IProductSimple[]>;
  getProductDetail: (id: number) => Observable<IProductDetail>;
  createProduct: (productDetail: IProductDetail) => Observable<boolean>;
  deleteProduct: (productDetail: IProductDetail) => Observable<boolean>;
  updateProduct: (productDetail: IProductDetail) => Observable<boolean>;

  getClients: () => Observable<IClient[]>;
  updateClient: (client: IClient) => Observable<boolean>;
  deleteClient: (client: IClient) => Observable<boolean>;
  createClient: (client: IClient) => Observable<boolean>;

  getResourceOwners: () => Observable<IResourceOwner[]>;
  updateResourceOwner: (resourceOwner: IResourceOwner) => Observable<boolean>;
  updateResourceOwnerPwd: (resourceOwner: IResourceOwnerUpdatePwd) => Observable<boolean>;
  deleteResourceOwner: (resourceOwner: IResourceOwner) => Observable<boolean>;

  authorize: (authorizeParty: IAuthorizeParty) => Observable<IAuthorizeCode>;
  revokeClientToken: (clientId: string) => Observable<boolean>;
  revokeResourceOwnerToken: (resourceOwnerName: string) => Observable<boolean>;
  getSecurityProfiles: () => Observable<ISecurityProfile[]>;
  createSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
  updateSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
  batchUpdateSecurityProfile: (securitypProfile: { [key: string]: string }) => Observable<boolean>;
  deleteSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
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
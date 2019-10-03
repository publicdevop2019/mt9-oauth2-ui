import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IClient } from '../page/summary-client/summary-client.component';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';

// regulate interface
export interface INetworkService {
    authenticatedEmail: string
    currentUserAuthInfo: ITokenResponse;
    authorizeParty: IAuthorizeParty;
    login: (fg: FormGroup) => Observable<ITokenResponse>;
    register: (fg: FormGroup) => Observable<any>;
    refreshToken: () => Observable<ITokenResponse>;
    getClients: () => Observable<IClient[]>;
    updateClient: (client: IClient) => Observable<boolean>;
    deleteClient: (client: IClient) => Observable<boolean>;
    createClient: (client: IClient) => Observable<boolean>;
    getResourceOwners: () => Observable<IResourceOwner[]>;
    updateResourceOwner: (resourceOwner: IResourceOwner) => Observable<boolean>;
    updateResourceOwnerPwd: (resourceOwner: IResourceOwner) => Observable<boolean>;
    deleteResourceOwner: (resourceOwner: IResourceOwner) => Observable<boolean>;
    authorize: (authorizeParty: IAuthorizeParty) => Observable<IAuthorizeCode>;
    revokeClientToken: (clientId: string) => Observable<boolean>;
    revokeResourceOwnerToken: (resourceOwnerName: string) => Observable<boolean>;
    getSecurityProfiles: () => Observable<ISecurityProfile[]>;
    createSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
    updateSecurityProfile: (securitypProfile: ISecurityProfile) => Observable<boolean>;
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

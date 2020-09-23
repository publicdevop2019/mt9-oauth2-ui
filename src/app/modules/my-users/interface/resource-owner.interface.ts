export interface IUserSumRep{
    data: IResourceOwner[],
    totalItemCount?: number
}
export interface IResourceOwner {
    id: number,
    email: string;
    password?: string;
    locked: boolean;
    subscription?: boolean;
    grantedAuthorities: string[];
    createdAt?:number;
}
export interface IPendingResourceOwner {
    email: string;
    password?: string;
    activationCode?: string;
}
export interface IForgetPasswordRequest {
    email: string;
    token?: string;
    newPassword?: string;
}
export interface IResourceOwnerUpdatePwd {
    password: string;
    currentPwd: string;
}
export interface IResourceOwner {
    id: number,
    email?: string;
    password?: string;
    locked: boolean;
    subscription?: boolean;
    grantedAuthorities: string[];
    createdAt?:number;
    version:number;
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
export const USER_ROLE_ENUM=[
    { label: 'ROLE_ADMIN', value: "ROLE_ADMIN" },
    { label: 'ROLE_USER', value: "ROLE_USER" },
]
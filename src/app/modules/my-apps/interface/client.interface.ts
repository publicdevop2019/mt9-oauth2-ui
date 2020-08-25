export interface IAuthority {
  grantedAuthority: string;
}
export enum grantTypeEnums {
  refresh_token = 'refresh_token',
  password = 'password',
  client_credentials = 'client_credentials',
  authorization_code = 'authorization_code'
}
export enum scopeEnums {
  read = 'read',
  write = 'write',
  trust = 'trust'
}
export interface IClient {
  id?: number;
  clientId: string;
  clientSecret?: string;
  description?: string;
  grantTypeEnums: grantTypeEnums[];
  grantedAuthorities: IAuthority[];
  scopeEnums: scopeEnums[];
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  resourceIds: string[]
  hasSecret: boolean;
  resourceIndicator: boolean;
  registeredRedirectUri: string[];
  autoApprove?: boolean;
}
export interface IClientSumRep {
  data: IClient[],
  totalItemCount?: number
}
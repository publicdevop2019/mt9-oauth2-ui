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
  name: string;
  id: number;
  clientSecret?: string;
  description?: string;
  grantTypeEnums: grantTypeEnums[];
  grantedAuthorities: string[];
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
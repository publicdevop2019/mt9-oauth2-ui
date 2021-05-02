export interface IEndpoint {
  resourceId: string;
  description?: string;
  path: string;
  method?: string;
  id: string;
  websocket: boolean;
  clientRoles?: Set<string>;
  userRoles?: Set<string>;
  clientScopes?: Set<string>;
  secured: boolean;
  csrfEnabled: boolean;
  userOnly?: boolean;
  clientOnly?: boolean;
  version: number;
}
export const HTTP_METHODS = [
  { label: 'HTTP_GET', value: "GET" },
  { label: 'HTTP_POST', value: "POST" },
  { label: 'HTTP_PUT', value: "PUT" },
  { label: 'HTTP_DELETE', value: "DELETE" },
  { label: 'HTTP_PATCH', value: "PATCH" },
]
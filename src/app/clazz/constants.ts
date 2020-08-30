import { IOption } from 'mt-form-builder/lib/classes/template.interface';

export const CONST_ROLES: IOption[] = [
    { label: 'ROLE_FRONTEND', value: "ROLE_FRONTEND" },
    { label: 'ROLE_BACKEND', value: "ROLE_BACKEND" },
    { label: 'ROLE_FIRST_PARTY', value: "ROLE_FIRST_PARTY" },
    { label: 'ROLE_THIRD_PARTY', value: "ROLE_THIRD_PARTY" },
    { label: 'ROLE_TRUST', value: "ROLE_TRUST" },
    { label: 'ROLE_ROOT', value: "ROLE_ROOT" },
]
export const CONST_GRANT_TYPE: IOption[] = [
    { label: 'CLIENT_CREDENTIALS', value: "client_credentials" },
    { label: 'PASSWORD', value: "password" },
    { label: 'AUTHORIZATION_CODE', value: "authorization_code" },
    { label: 'REFRESH_TOKEN', value: "refresh_token" }
]
export const CONST_HTTP_METHOD: IOption[] = [
    { label: 'HTTP_GET', value: "GET" },
    { label: 'HTTP_POST', value: "POST" },
    { label: 'HTTP_PUT', value: "PUT" },
    { label: 'HTTP_DELETE', value: "DELETE" },
    { label: 'HTTP_PATCH', value: "PATCH" },
]
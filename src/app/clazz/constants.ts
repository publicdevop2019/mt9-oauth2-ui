import { IOption } from 'mt-form-builder/lib/classes/template.interface';

export const CONST_ROLES: IOption[] = [
    { label: 'ROLE_FRONTEND', value: "ROLE_FRONTEND" },
    { label: 'ROLE_BACKEND', value: "ROLE_BACKEND" },
    { label: 'ROLE_FIRST_PARTY', value: "ROLE_FIRST_PARTY" },
    { label: 'ROLE_THIRD_PARTY', value: "ROLE_THIRD_PARTY" },
    { label: 'ROLE_TRUST', value: "ROLE_TRUST" },
    { label: 'ROLE_ROOT', value: "ROLE_ROOT" },
]
export const CONST_ROLES_USER: IOption[] = [
    { label: 'ROLE_ROOT_USER', value: "ROLE_ROOT" },
    { label: 'ROLE_ADMIN', value: "ROLE_ADMIN" },
    { label: 'ROLE_USER', value: "ROLE_USER" },
]
export const CONST_GRANT_TYPE: IOption[] = [
    { label: 'CLIENT_CREDENTIALS', value: "CLIENT_CREDENTIALS" },
    { label: 'PASSWORD', value: "PASSWORD" },
    { label: 'AUTHORIZATION_CODE', value: "AUTHORIZATION_CODE" },
    { label: 'REFRESH_TOKEN', value: "REFRESH_TOKEN" }
]
export const CONST_HTTP_METHOD: IOption[] = [
    { label: 'HTTP_GET', value: "GET" },
    { label: 'HTTP_POST', value: "POST" },
    { label: 'HTTP_PUT', value: "PUT" },
    { label: 'HTTP_DELETE', value: "DELETE" },
    { label: 'HTTP_PATCH', value: "PATCH" },
]
export const CONST_ATTR_TYPE: IOption[] = [
    { label: 'KEY_ATTR', value: "KEY_ATTR" },
    { label: 'SALES_ATTR', value: "SALES_ATTR" },
    { label: 'PROD_ATTR', value: "PROD_ATTR" },
    { label: 'GEN_ATTR', value: "GEN_ATTR" },
]
export const CATALOG_TYPE = {
    BACKEND: 'type:BACKEND',
    FRONTEND: 'type:FRONTEND'
}
export const GRANT_TYPE_LIST = [
    { label: 'CLIENT_CREDENTIALS', value: "CLIENT_CREDENTIALS" },
    { label: 'PASSWORD', value: "PASSWORD" },
    { label: 'AUTHORIZATION_CODE', value: "AUTHORIZATION_CODE" },
]
export const GRANT_TYPE_LIST_EXT = [
    ...GRANT_TYPE_LIST,
    { label: 'REFRESH_TOKEN', value: "REFRESH_TOKEN" },
]
export const CLIENT_ROLE_LIST = [
    { label: 'ROLE_FRONTEND', value: "ROLE_FRONTEND" },
    { label: 'ROLE_BACKEND', value: "ROLE_BACKEND" },
    { label: 'ROLE_FIRST_PARTY', value: "ROLE_FIRST_PARTY" },
    { label: 'ROLE_THIRD_PARTY', value: "ROLE_THIRD_PARTY" },
    { label: 'ROLE_TRUST', value: "ROLE_TRUST" },
    { label: 'ROLE_ROOT', value: "ROLE_ROOT" },
]
export const RESOURCE_CLIENT_ROLE_LIST = [
    { label: 'ROLE_BACKEND', value: "ROLE_BACKEND" },
    { label: 'ROLE_FIRST_PARTY', value: "ROLE_FIRST_PARTY" },
]
export const SCOPE_LIST=[
    { label: 'READ', value: "READ" },
    { label: 'WRITE', value: "WRITE" },
    { label: 'TRUST', value: "TRUST" },
]
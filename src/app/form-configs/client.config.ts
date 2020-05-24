import { IForm } from 'mt-form-builder/lib/classes/template.interface';

export const FORM_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "text",
            "display": false,
            "label": "ID",
            "key": "id",
            "position": {
                "row": "0",
                "column": "0"
            }
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_CLIENT_ID",
            "key": "clientId",
            "position": {
                "row": "1",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "hasSecret",
            "position": {
                "row": "2",
                "column": "0"
            },
            "options": [
                "Has secret"
            ],
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_CLIENT_SECRET",
            "key": "clientSecret",
            "position": {
                "row": "3",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
        {
            "type": "select",
            "display": true,
            "label": "SELECT_A_GRANT＿TYPE",
            "key": "grantType",
            "position": {
                "row": "4",
                "column": "0"
            },
            "options": [
                "client_credentials", "password", "authorization_code"
            ],
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_REDIRECT_URI",
            "key": "registeredRedirectUri",
            "position": {
                "row": "5",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "",
            "key": "refreshToken",
            "position": {
                "row": "6",
                "column": "0"
            },
            "options": [
                "Add Refresh Token"
            ]
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "resourceIndicator",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                "Set As Resource"
            ],
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "",
            "key": "autoApprove",
            "position": {
                "row": "8",
                "column": "0"
            },
            "options": [
                "Auto approve authorize request"
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "PLEASE_SELECT_AUTHORITY(S)",
            "key": "authority",
            "position": {
                "row": "9",
                "column": "0"
            },
            "options": [
                "ROLE_FRONTEND",
                "ROLE_BACKEND",
                "ROLE_FIRST_PARTY",
                "ROLE_THIRD_PARTY",
                "ROLE_TRUST",
                "ROLE_ROOT",
            ],
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
            ]
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "PLEASE_SELECT_SCOPE(S)",
            "key": "scope",
            "position": {
                "row": "10",
                "column": "0"
            },
            "direction": 'row',
            "options": [
                "read",
                "write",
                "trust",
            ],
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
            ]
        },
        {
            "type": "observable-checkbox",
            "display": true,
            "label": "PLEASE_SELECT_RESOUCE_ID(S)",
            "key": "resourceId",
            "position": {
                "row": "11",
                "column": "0"
            },
            "options": [
            ],
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
        {
            "type": "text",
            "display": true,
            "label": "ACCESS_TOKEN_VALIDITY_SECONDS",
            "key": "accessTokenValiditySeconds",
            "position": {
                "row": "12",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
                {
                    "type": "numberOnly",
                    "errorMsg": "only number is allowed"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "REFRESH_TOKEN_VALIDITY_SECONDS",
            "key": "refreshTokenValiditySeconds",
            "position": {
                "row": "13",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
                {
                    "type": "numberOnly",
                    "errorMsg": "only number is allowed"
                }
            ]
        },
    ],
}

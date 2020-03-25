import { IForm } from 'magic-form/lib/classes/template.interface';

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
            "label": "Enter client id",
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
            "label": "Enter client secret",
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
            "label": "Select a grant type",
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
            "label": "Enter redirect uri",
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
            "label": "Please select authority(s)",
            "key": "authority",
            "direction":'row',
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
            "label": "Please select scope(s)",
            "key": "scope",
            "position": {
                "row": "10",
                "column": "0"
            },
            "direction":'row',
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
            "type": "checkbox",
            "display": true,
            "label": "Please select resouce id(s)",
            "key": "resourceId",
            "position": {
                "row": "11",
                "column": "0"
            },
            "options": [
            ],
        },
        {
            "type": "text",
            "display": true,
            "label": "Access Token validity seconds",
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
            "label": "Refresh Token validity seconds",
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
    "column": 1,
    "ratio": "10:1"
}

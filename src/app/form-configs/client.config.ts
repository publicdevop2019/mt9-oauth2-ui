import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { CLIENT_ROLE_LIST, GRANT_TYPE_LIST, SCOPE_LIST } from '../clazz/validation/constant';

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
            "label": "ENTER_NAME",
            "key": "name",
            "position": {
                "row": "1",
                "column": "0"
            }
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_DESCRIPTION",
            "key": "description",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "hasSecret",
            "position": {
                "row": "3",
                "column": "0"
            },
            "options": [
                { label: 'HAS_SECRET', value: "Has secret" }
            ],
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_CLIENT_SECRET",
            "key": "clientSecret",
            "position": {
                "row": "4",
                "column": "0"
            },
            required:true,
        },
        {
            "type": "select",
            "display": true,
            "label": "SELECT_A_GRANT＿TYPE",
            "key": "grantType",
            "position": {
                "row": "5",
                "column": "0"
            },
            "options": GRANT_TYPE_LIST,
            required:true,
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_REDIRECT_URI",
            "key": "registeredRedirectUri",
            "position": {
                "row": "6",
                "column": "0"
            },
            required:true,
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "",
            "key": "refreshToken",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                { label: 'ADD_REFRESH_TOKEN', value: "Add Refresh Token" },
            ]
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "",
            "key": "resourceIndicator",
            "position": {
                "row": "8",
                "column": "0"
            },
            "options": [
                { label: 'SET_AS_RESOURCE', value: "Set As Resource" },
            ],
        },
        {
            "type": "checkbox",
            "display": false,
            "label": "",
            "key": "autoApprove",
            "position": {
                "row": "9",
                "column": "0"
            },
            "options": [
                { label: 'AUTO_APPROVE_AUTHORIZE_REQUEST', value: "Auto approve authorize request" },
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "PLEASE_SELECT_AUTHORITY(S)",
            "key": "authority",
            "position": {
                "row": "10",
                "column": "0"
            },
            "options": CLIENT_ROLE_LIST,
            required:true,
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "PLEASE_SELECT_SCOPE(S)",
            "key": "scope",
            "position": {
                "row": "11",
                "column": "0"
            },
            "direction": 'row',
            "options": SCOPE_LIST,
            required:true,
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "PLEASE_SELECT_RESOUCE_ID(S)",
            required:true,
            "key": "resourceId",
            "position": {
                "row": "12",
                "column": "0"
            },
            "options": [
            ],
        },
        {
            "type": "text",
            "display": true,
            "label": "ACCESS_TOKEN_VALIDITY_SECONDS",
            "key": "accessTokenValiditySeconds",
            "position": {
                "row": "13",
                "column": "0"
            },
            required:true,
        },
        {
            "type": "text",
            "display": false,
            "label": "REFRESH_TOKEN_VALIDITY_SECONDS",
            "key": "refreshTokenValiditySeconds",
            "position": {
                "row": "14",
                "column": "0"
            },
            required:true,
        },
    ],
}

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
            "label": "Enter email",
            "key": "email",
            "readonly": true,
            "position": {
                "row": "1",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_YOUR_CURRENT_PASSWORD",
            "key": "currentPwd",
            "position": {
                "row": "2",
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
            "type": "text",
            "display": false,
            "label": "ENTER_YOUR_NEW_PASSWORD",
            "key": "pwd",
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
            "type": "text",
            "display": false,
            "label": "REENTER_YOUR_NEW_PASSWORD",
            "key": "confirmPwd",
            "position": {
                "row": "4",
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
            "label": "PLEASE_SELECT_AUTHORITY(S)",
            "key": "authority",
            "position": {
                "row": "5",
                "column": "0"
            },
            "options": [
                { label: 'ROLE_ADMIN', value: "ROLE_ADMIN" },
                { label: 'ROLE_USER', value: "ROLE_USER" },
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "LOCK_OR_UNLOCK_USER",
            "key": "locked",
            "position": {
                "row": "6",
                "column": "0"
            },
            "options": [
                { label: 'LOCK', value: "Lock" },
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "NEW_ORDER_SUBSCRIBE",
            "key": "subNewOrder",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                { label: 'SUBSCRIBE_FOR_NEW_ORDER', value: "Subscribe for new order" },
            ],
        },
    ],
}

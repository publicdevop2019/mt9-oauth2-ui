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
            "label": "Enter your current password",
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
            "label": "Enter your new password",
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
            "label": "Re-enter your new password",
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
            "label": "Please select authority(s)",
            "key": "authority",
            "position": {
                "row": "5",
                "column": "0"
            },
            "options": [
                "ROLE_ADMIN", "ROLE_USER"
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "Lock or unlock user",
            "key": "locked",
            "position": {
                "row": "6",
                "column": "0"
            },
            "options": [
                "Lock"
            ],
        },
        {
            "type": "checkbox",
            "display": true,
            "label": "New Order Subscribe",
            "key": "subNewOrder",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                "Subscribe for new order"
            ],
        },
    ],
    "column": 1,
    "ratio": "10:1"
}

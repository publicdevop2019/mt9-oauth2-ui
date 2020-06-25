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
            "label": "ENTER_NAME",
            "key": "name",
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
            "type": "radio",
            "display": true,
            "label": "ENTER_METHOD",
            "key": "method",
            "position": {
                "row": "2",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ],
            "options": [
                { label: 'MANUAL', value: "MANUAL" },
                { label: 'SELECT', value: "SELECT" },
            ],
        },
        {
            "type": "select",
            "display": true,
            "label": "SELECT_ATTR_TYPE",
            "key": "type",
            "position": {
                "row": "3",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ],
            "options": [
                { label: 'KEY_ATTR', value: "key" },
                { label: 'SALES_ATTR', value: "sales" },
                { label: 'PROD_ATTR', value: "product" },
                { label: 'GEN_ATTR', value: "general" },
            ],
        },
    ],
}
export const FORM_CONFIG_ATTR_VALUE: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "label": "ENTER_VALUE",
            "key": "attrValue",
            "position": {
                "row": "0",
                "column": "0"
            }
        },
    ],
}

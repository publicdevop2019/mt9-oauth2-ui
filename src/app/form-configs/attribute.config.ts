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
            "type": "text",
            "display": true,
            "label": "ENTER_VALUE",
            "key": "value",
            "position": {
                "row": "3",
                "column": "0"
            },
        },
    ],
}

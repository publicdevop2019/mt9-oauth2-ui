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
            "label": "Enter resource id",
            "key": "resourceID",
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
            "type": "text",
            "display": true,
            "label": "Enter endpoint",
            "key": "path",
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
            "type": "select",
            "display": true,
            "label": "Select method",
            "key": "method",
            "position": {
                "row": "3",
                "column": "0"
            },
            "options": [
                "GET", "POST", "PUT", "DELETE"
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
            "label": "Enter security expression",
            "key": "expression",
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
            "type": "text",
            "display": true,
            "label": "Enter url",
            "key": "url",
            "position": {
                "row": "5",
                "column": "0"
            },
        }
    ],
}

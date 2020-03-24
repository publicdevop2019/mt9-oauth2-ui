import { IForm } from 'magic-form/lib/classes/template.interface';

export const FORM_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "label": "Enter title",
            "key": "title",
            "position": {
                "row": "0",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
    ],
    "column": 1,
    "ratio": "10:1"
}

import { IForm } from 'mt-form-builder/lib/classes/template.interface';
export const ATTR_PROD_FORM_CONFIG: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "select",
            "display": true,
            "label": "SELECT_AN_PROD_ATTRIBUTE",
            "key": "attributeId",
            "position": {
                "row": "0",
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
            "type": "select",
            "display": false,
            "label": "SELECT_AN_ATTRIBUTE_VALUE",
            "key": "attributeValueSelect",
            "position": {
                "row": "0",
                "column": "1"
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
            "display": false,
            "label": "ENTER_AN_ATTRIBUTE_VALUE",
            "key": "attributeValueManual",
            "position": {
                "row": "0",
                "column": "1"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                }
            ]
        },
    ],
}

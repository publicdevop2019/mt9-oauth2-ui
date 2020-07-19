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
    ],
}
export const FORM_CATALOG_CONFIG: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "select",
            "display": true,
            "label": "ENTER_LINKED_CATALOG_IDS",
            "key": "catalogId",
            "position": {
                "row": "0",
                "column": "0"
            },
            "options":[]
        },
    ],
}
export const FORM_FILTER_ITEM_CONFIG: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "select",
            "display": true,
            "label": "SELECT_AN_ATTRIBUTE",
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
            "type": "form",
            "display": true,
            "label": "",
            "key": "filterForm",
            "form": {
                "repeatable": true,
                "inputs": [
                    {
                        "type": "text",
                        "display": true,
                        "label": "ENTER_VALUE",
                        "key": "value",
                        "position": {
                            "row": "0",
                            "column": "0"
                        }
                    },
                ]
            },
            "position": {
                "row": "3",
                "column": "0"
            }
        },
    ],
}

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
            "label": "KEY_ATTR",
            "readonly": true,
            "key": "attributesKey",
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
            "label": "ENTER_NAME",
            "key": "name",
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
            "display": true,
            "label": "ENTER_PRICE",
            "key": "price",
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
            "type": "file",
            "display": true,
            "label": "UPLOAD_PRODUCT_IMAGE_SMALL",
            "key": "imageUrlSmallFile",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly": true,
            "label": "COVERAGE_IMAGE_URL",
            "key": "imageUrlSmall",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_DESCRIPTION",
            "key": "description",
            "position": {
                "row": "6",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_SALES",
            "key": "sales",
            "position": {
                "row": "7",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_RATE",
            "key": "rate",
            "position": {
                "row": "8",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_INCREASE_ORDER_STORAGE_AMOUNT",
            "key": "increaseOrderStorageBy",
            "position": {
                "row": "11",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_DECREASE_ORDER_STORAGE_AMOUNT",
            "key": "decreaseOrderStorageBy",
            "position": {
                "row": "12",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_INCREASE_ACTUAL_STORAGE_AMOUNT",
            "key": "increaseActualStorageBy",
            "position": {
                "row": "13",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_DECREASE_ACTUAL_STORAGE_AMOUNT",
            "key": "decreaseActualStorageBy",
            "position": {
                "row": "14",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
    ],
}


export const FORM_CONFIG_IMAGE: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "label": "ENTER_IMAGE_URL",
            "key": "imageUrl",
            "position": {
                "row": "0",
                "column": "0"
            }
        },
    ],
}

export const FORM_CONFIG_OPTIONS: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "label": "ENTER_PRODUCT_OPTION_TITLE",
            "key": "productOption",
            "position": {
                "row": "0",
                "column": "0"
            }
        },
        {
            "type": "form",
            "display": true,
            "label": "",
            "key": "optionForm",
            "form": {
                "repeatable": true,
                "inputs": [
                    {
                        "type": "text",
                        "display": true,
                        "label": "ENTER_OPTION_VALUE",
                        "key": "optionValue",
                        "position": {
                            "row": "0",
                            "column": "0"
                        }
                    },
                    {
                        "type": "text",
                        "display": true,
                        "label": "ENTER_OPTION_PRICE_CHANGE",
                        "key": "optionPriceChange",
                        "position": {
                            "row": "0",
                            "column": "1"
                        }
                    },
                ]
            },
            "position": {
                "row": "1",
                "column": "0"
            }
        },

    ],
}
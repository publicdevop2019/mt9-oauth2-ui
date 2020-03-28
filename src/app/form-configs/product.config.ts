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
            "label": "Enter Category",
            "key": "category",
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
            "label": "Enter Name",
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
            "label": "Enter Price",
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
            "label": "Upload product image small",
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
            "label": "Coverage Image Url",
            "key": "imageUrlSmall",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "Enter description",
            "key": "description",
            "position": {
                "row": "6",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "Enter sales",
            "key": "sales",
            "position": {
                "row": "7",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "Enter rate",
            "key": "rate",
            "position": {
                "row": "8",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "Enter initial order storage",
            "key": "orderStorage",
            "position": {
                "row": "9",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
        {
            "type": "text",
            "display": true,
            "label": "Enter initial actual storage",
            "key": "actualStorage",
            "position": {
                "row": "10",
                "column": "0"
            },
            "attributes": [
                {
                    "type": "required",
                    "errorMsg": "field cannot be empty"
                },
                {
                    "type": "numberOnly",
                    "errorMsg": "please enter number"
                }
            ]
        },
        {
            "type": "text",
            "display": false,
            "label": "Enter increase order storage amount",
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
            "label": "Enter decrease order storage amount",
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
            "label": "Enter increase actual storage amount",
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
            "label": "Enter decrease actual storage amount",
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
            "label": "Enter image url",
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
            "label": "Enter product option title",
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
            form: {
                repeatable: true,
                inputs: [
                    {
                        "type": "text",
                        "display": true,
                        "label": "Enter option value",
                        "key": "optionValue",
                        "position": {
                            "row": "0",
                            "column": "0"
                        }
                    },
                    {
                        "type": "text",
                        "display": true,
                        "label": "Enter option price change",
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
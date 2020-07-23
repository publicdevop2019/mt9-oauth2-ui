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
            "type": "select",
            "display": true,
            "label": "PLEASE_SELECT_BACKEND_CATALOG",
            "key": "selectBackendCatalog",
            "position": {
                "row": "1",
                "column": "0"
            },
            "options": [],
        },
        {
            "type": "text",
            "display": true,
            "disabled": false,
            "label": "INHERIT_ATTR",
            "key": "attributesKey",
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
            "label": "ENTER_NAME",
            "key": "name",
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
            "type": "radio",
            "display": true,
            "label": "PUBLISH_AFTER_CREATE",
            "key": "status",
            "position": {
                "row": "7",
                "column": "0"
            },
            "options": [
                { label: 'YES', value: "AVAILABLE" },
                { label: 'NO', value: "UNAVAILABLE" },
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
            "label": "CONFIG_START_DATE",
            "key": "startAt",
            "position": {
                "row": "8",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "CONFIG_END_DATE",
            "key": "endAt",
            "position": {
                "row": "9",
                "column": "0"
            },
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

export const ATTR_SALE_FORM_CONFIG_IMAGE: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "select",
            "display": true,
            "label": "SELECT_AN_SALES_ATTRIBUTE",
            "key": "attributeId",
            "options":[],
            "position": {
                "row": "0",
                "column": "0"
            }
        },
        {
            "type": "select",
            "display": false,
            "label": "SELECT_AN_ATTRIBUTE_VALUE",
            "key": "attributeValueSelect",
            "options":[],
            "position": {
                "row": "0",
                "column": "1"
            }
        },
        {
            "type": "text",
            "display": false,
            "label": "ENTER_AN_ATTRIBUTE_VALUE",
            "key": "attributeValueManual",
            "position": {
                "row": "0",
                "column": "1"
            }
        },
        {
            "type": "form",
            "display": true,
            "label": "",
            "key": "imageChildForm",
            "form": {
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
                ]
            },
            "position": {
                "row": "1",
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
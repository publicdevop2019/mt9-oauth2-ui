import { IForm } from 'mt-form-builder/lib/classes/template.interface';

export const ORDER_PRODUCT_CONFIG: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "imageUpload",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_COVER_IMAGE",
            "key": "imageUrlSmall",
            "position": {
                "row": "0",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_ID",
            "key": "productId",
            "position": {
                "row": "1",
                "column": "0"
            }
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_NAME",
            "key": "name",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_FINAL_PRICE",
            "key": "finalPrice",
            "position": {
                "row": "3",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_SELECT_OPTIONS",
            "key": "selectedOptions",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_PRODUCT_SALES_ATTR",
            "key": "attributesSales",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
    ],
}
export const ORDER_ADDRESS_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_FULLNAME",
            "key": "orderAddressFullName",
            "position": {
                "row": "0",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_LINE1",
            "key": "orderAddressLine1",
            "position": {
                "row": "1",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_LINE2",
            "key": "orderAddressLine2",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_POSTAL_CODE",
            "key": "orderAddressPostalCode",
            "position": {
                "row": "3",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_PHONE_NUMBER",
            "key": "orderAddressPhoneNumber",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_CITY",
            "key": "orderAddressCity",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_PROVINCE",
            "key": "orderAddressProvince",
            "position": {
                "row": "6",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_ADDRESS_COUNTRY",
            "key": "orderAddressCountry",
            "position": {
                "row": "7",
                "column": "0"
            },
        },
    ],
}

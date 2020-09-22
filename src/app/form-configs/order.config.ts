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
export const ORDER_DETAIL_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_ID",
            "key": "id",
            "position": {
                "row": "0",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_PAYMENT_TYPE",
            "key": "paymentType",
            "position": {
                "row": "1",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_PAYMENT_LINK",
            "key": "paymentLink",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_PAYMENT_AMT",
            "key": "paymentAmt",
            "position": {
                "row": "3",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_PAID",
            "key": "paid",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_ORDER_STATE",
            "key": "orderState",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_MODIFIED_BY_USER_AT",
            "key": "modifiedByUserAt",
            "position": {
                "row": "6",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_CREATED_BY",
            "key": "createdBy",
            "position": {
                "row": "7",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_CREATED_AT",
            "key": "createdAt",
            "position": {
                "row": "8",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_MODIFIED_BY",
            "key": "modifiedBy",
            "position": {
                "row": "9",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_DETAIL_MODIFIED_AT",
            "key": "modifiedAt",
            "position": {
                "row": "10",
                "column": "0"
            },
        },
    ],
}
export const ORDER_TASK_CONFIG: IForm = {
    "repeatable": true,
    "inputs": [
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_ID",
            "key": "id",
            "position": {
                "row": "0",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_NAME",
            "key": "taskName",
            "position": {
                "row": "1",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_STATUS",
            "key": "taskStatus",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_TX_ID",
            "key": "transactionId",
            "position": {
                "row": "3",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_CREATED_AT",
            "key": "createdAt",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_CREATED_BY",
            "key": "createdBy",
            "position": {
                "row": "5",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_MODIFIED_AT",
            "key": "modifiedAt",
            "position": {
                "row": "6",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_MODIFIED_BY",
            "key": "modifiedBy",
            "position": {
                "row": "7",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_REFERENCE_ID",
            "key": "referenceId",
            "position": {
                "row": "8",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "ORDER_TASK_VERSION",
            "key": "version",
            "position": {
                "row": "9",
                "column": "0"
            },
        },
    ],
}

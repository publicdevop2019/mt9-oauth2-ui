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
            "readonly":true,
            "label": "Customer address",
            "key": "address",
            "position": {
                "row": "1",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "Customer product list",
            "key": "productList",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "readonly":true,
            "label": "Payment amount",
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
            "label": "Payment method",
            "key": "paymentType",
            "position": {
                "row": "4",
                "column": "0"
            },
        },
    ],
}

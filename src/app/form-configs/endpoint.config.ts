import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { HTTP_METHODS } from '../clazz/validation/aggregate/endpoint/interfaze-endpoint';

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
            "label": "ENTER_RESOURCE_ID",
            "key": "resourceId",
            "position": {
                "row": "1",
                "column": "0"
            },
            required:true,
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_DESCRIPTION",
            "key": "description",
            "position": {
                "row": "2",
                "column": "0"
            },
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_ENDPOINT",
            "key": "path",
            "position": {
                "row": "3",
                "column": "0"
            },
            required:true,
        },
        {
            "type": "select",
            "display": true,
            "label": "SELECT_METHOD",
            "key": "method",
            "position": {
                "row": "4",
                "column": "0"
            },
            "options":HTTP_METHODS,
            required:true,
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_SECURITY_EXPRESSION",
            "key": "expression",
            "position": {
                "row": "5",
                "column": "0"
            },
            required:true,
        },
    ],
}

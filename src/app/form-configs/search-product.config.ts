import { IForm } from 'mt-form-builder/lib/classes/template.interface';
export const FORM_SEARCH_CONFIG: IForm = {
    "repeatable": false,
    "inputs": [
        {
            "type": "select",
            "display": true,
            "label": "SELECT_A_SEARCH_TYPE",
            "key": "searchType",
            "position": {
                "row": "0",
                "column": "0"
            },
            "options": [
                { "label": "SEARCH_BY_ID", "value": "byId" },
                { "label": "SEARCH_BY_NAME", "value": "byName" },
                { "label": "SEARCH_BY_ATTRIBUTES", "value": "byAttr" },
                { "label": "SEARCH_BY_CATALOG_FRONT", "value": "byCatalogFront" },
                { "label": "SEARCH_BY_CATALOG_BACK", "value": "byCatalogBack" },
            ],
        },
        {
            "type": "text",
            "display": true,
            "label": "ENTER_SEARCH_VALUE",
            "key": "searchValueManual",
            "position": {
                "row": "0",
                "column": "1"
            }
        },
        {
            "type": "select",
            "display": false,
            "label": "SELECT_SEARCH_VALUE",
            "key": "searchValueSelect",
            "position": {
                "row": "0",
                "column": "1"
            }
        },
        {
            "type": "text",
            "display": true,
            "label": "SEARCH",
            "key": "search",
            "position": {
                "row": "1",
                "column": "0"
            }
        },
    ],
}

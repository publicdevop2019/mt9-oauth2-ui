import { ErrorMessage, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { ICatalog } from './interfaze-catalog';

export class CatalogValidator implements IAggregateValidator {
    private adminCreateCatalogCommandValidator: Map<string, TValidator> = new Map();
    private adminUpdateCatalogCommandValidator: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.adminCreateCatalogCommandValidator.set('name', this.nameValidator);
        this.adminCreateCatalogCommandValidator.set('parentId', this.parentIdValidator);
        this.adminCreateCatalogCommandValidator.set('attributes', this.attributesValidator);
        this.adminCreateCatalogCommandValidator.set('catalogType', this.catalogTypeValidator);
        
        this.adminUpdateCatalogCommandValidator.set('name', this.nameValidator);
        this.adminUpdateCatalogCommandValidator.set('parentId', this.parentIdValidator);
        this.adminUpdateCatalogCommandValidator.set('attributes', this.attributesValidator);
        this.adminUpdateCatalogCommandValidator.set('catalogType', this.catalogTypeValidator);
    }
    public validate(client: ICatalog, context: string): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.adminCreateCatalogCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else if (context === 'UPDATE') {
                this.adminUpdateCatalogCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            if (context === 'CREATE') {
                //fail fast for server
                this.adminCreateCatalogCommandValidator.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                //fail fast for server
                this.adminUpdateCatalogCommandValidator.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }

        }
        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    nameValidator = (key: string, payload: ICatalog) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
        StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        return results
    }
    parentIdValidator = (key: string, payload: ICatalog) => {
        let results: ErrorMessage[] = [];
        if (payload[key]) {
            NumberValidator.isNumber(payload[key], results, key)
            NumberValidator.isInteger(payload[key], results, key)
        }
        return results
    }
    attributesValidator = (key: string, payload: ICatalog) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key)
        return results
    }
    catalogTypeValidator = (key: string, payload: ICatalog) => {
        let results: ErrorMessage[] = [];
        StringValidator.belongsTo(payload[key], ['BACKEND', 'FRONTEND'], results, key)
        return results
    }
}


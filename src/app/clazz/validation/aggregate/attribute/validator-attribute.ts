import { ErrorMessage, IAggregateValidator, ListValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { IBizAttribute } from './interfaze-attribute';

export class AttributeValidator implements IAggregateValidator {
    private adminCreateAttributeCommandValidator: Map<string, TValidator> = new Map();
    private adminUpdateAttributeCommandValidator: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.adminCreateAttributeCommandValidator.set('name', this.nameValidator);
        this.adminCreateAttributeCommandValidator.set('description', this.descriptionValidator);
        this.adminCreateAttributeCommandValidator.set('method', this.methodValidator);
        this.adminCreateAttributeCommandValidator.set('type', this.typeValidator);
        this.adminCreateAttributeCommandValidator.set('selectValues', this.selectValuesValidator);
        
        this.adminUpdateAttributeCommandValidator.set('name', this.nameValidator);
        this.adminUpdateAttributeCommandValidator.set('description', this.descriptionValidator);
        this.adminUpdateAttributeCommandValidator.set('method', this.methodValidator);
        this.adminUpdateAttributeCommandValidator.set('type', this.typeValidator);
        this.adminUpdateAttributeCommandValidator.set('selectValues', this.selectValuesValidator);
    }
    public validate(client: IBizAttribute, context: string): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.adminCreateAttributeCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else if (context === 'UPDATE') {
                this.adminUpdateAttributeCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            if (context === 'CREATE') {
                //fail fast for server
                this.adminCreateAttributeCommandValidator.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                //fail fast for server
                this.adminUpdateAttributeCommandValidator.forEach((fn, field) => {
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
    nameValidator = (key: string, payload: IBizAttribute) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
        StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        return results
    }
    descriptionValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        if (payload[key] !== null && payload[key] !== undefined) {
            StringValidator.hasValue(payload[key], results, key)
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
        }
        return results
    }
    methodValidator = (key: string, payload: IBizAttribute) => {
        let results: ErrorMessage[] = [];
        StringValidator.belongsTo(payload[key], ['MANUAL', 'SELECT'], results, key)
        return results
    }
    typeValidator = (key: string, payload: IBizAttribute) => {
        let results: ErrorMessage[] = [];
        StringValidator.belongsTo(payload[key], ['PROD_ATTR', 'SALES_ATTR', 'KEY_ATTR', 'GEN_ATTR'], results, key)
        return results
    }
    selectValuesValidator = (key: string, payload: IBizAttribute) => {
        let results: ErrorMessage[] = [];
        if (payload.method === 'SELECT') {
            ListValidator.hasValue(payload[key], results, key);
            if (payload[key] && payload[key].length > 0) {
                (payload[key] as string[]).forEach((e, index) => {
                    StringValidator.hasValue(e, results, index + '_valueOption')
                })
            }
        }
        return results
    }
}


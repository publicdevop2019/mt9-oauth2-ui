import { ErrorMessage, IAggregateValidator, ListValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { IBizFilter, IFilterItem } from './interfaze-filter';

export class FilterValidator implements IAggregateValidator {
    private adminCreateFilterCommandValidator: Map<string, TValidator> = new Map();
    private adminUpdateFilterCommandValidator: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.adminCreateFilterCommandValidator.set('description', this.descriptionValidator);
        this.adminCreateFilterCommandValidator.set('catalogs', this.catalogsValidator);
        this.adminCreateFilterCommandValidator.set('filters', this.filtersValidator);

        this.adminUpdateFilterCommandValidator.set('description', this.descriptionValidator);
        this.adminUpdateFilterCommandValidator.set('catalogs', this.catalogsValidator);
        this.adminUpdateFilterCommandValidator.set('filters', this.filtersValidator);
    }
    public validate(client: IBizFilter, context: string): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.adminCreateFilterCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else if (context === 'UPDATE') {
                this.adminUpdateFilterCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            if (context === 'CREATE') {
                //fail fast for server
                this.adminCreateFilterCommandValidator.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                //fail fast for server
                this.adminUpdateFilterCommandValidator.forEach((fn, field) => {
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
    descriptionValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        if (payload[key] !== null && payload[key] !== undefined) {
            StringValidator.hasValue(payload[key], results, key)
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
        }
        return results
    }
    catalogsValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key)
        return results
    }
    filtersValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key)
        if (payload[key] && payload[key].length > 0) {
            (payload[key] as IFilterItem[]).forEach((e, index) => {
                StringValidator.hasValue(e.name, results, index + '_filterItemName');
                ListValidator.hasValue(e.values, results, index + '_filterItemValue');
                (e.values as string[]).forEach((ee, ind) => {
                    StringValidator.hasValue(ee, results, index + '_' + ind + '_filterItemValueList')
                })
            })
        }
        return results
    }
}


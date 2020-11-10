import { ErrorMessage, IAggregateValidator, ListValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { IBizFilter, IFilterItem } from './interfaze-filter';

export class FilterValidator extends IAggregateValidator {
    private adminCreateFilterCommandValidator: Map<string, TValidator> = new Map();
    private adminUpdateFilterCommandValidator: Map<string, TValidator> = new Map();
    constructor(platform?: TPlatform) {
        super(platform)
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
    public validate(payload: IBizFilter, context: string): ErrorMessage[] {
        if (context === 'adminCreateFilterCommandValidator')
            return this.validationWPlatform(payload, this.adminCreateFilterCommandValidator)
        if (context === 'adminUpdateFilterCommandValidator')
            return this.validationWPlatform(payload, this.adminUpdateFilterCommandValidator)
    }
    descriptionValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        if (payload[key] !== null && payload[key] !== undefined) {
            StringValidator.hasValidValue(payload[key], results, key)
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
                StringValidator.hasValidValue(e.name, results, index + '_filterItemName');
                ListValidator.hasValue(e.values, results, index + '_filterItemValue');
                (e.values as string[]).forEach((ee, ind) => {
                    StringValidator.hasValidValue(ee, results, index + '_' + ind + '_filterItemValueList')
                })
            })
        }
        return results
    }
}


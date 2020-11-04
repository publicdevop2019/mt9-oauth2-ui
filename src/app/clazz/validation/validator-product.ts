import { IProductDetail, IProductOptions, ISku } from './interfaze-product';
import { DefaultValidator, ErrorMessage, hasValue, IAggregateValidator, ListValidator, notNullOrUndefined, NumberValidator, StringValidator, TValidatorContext } from './validator-common';

export class ProductValidator implements IAggregateValidator {
    private formId: string;
    constructor(formId: string) {
        this.formId = formId;
    }
    public validate(payload: IProductDetail, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (context === 'CREATE') {
            errors.push(...this.nameValidator('name', payload))
            errors.push(...this.descriptionValidator('description', payload))
            errors.push(...this.imageUrlSmallValidator('imageUrlSmall', payload))
            errors.push(...this.startAtValidator('startAt', payload))
            errors.push(...this.endAtValidator('endAt', payload))
            errors.push(...this.skusCreateValidator('skus', payload))
            errors.push(...this.attributeSaleImagesCreateValidator('attributeSaleImages', payload))
            errors.push(...this.imageUrlLargeValidator('imageUrlLarge', payload))
            errors.push(...this.selectedOptionsValidator('selectedOptions', payload))
            errors.push(...this.attributesKeyValidator('attributesKey', payload))
            errors.push(...this.attributesGenValidator('attributesGen', payload))
            errors.push(...this.attributesProdValidator('attributesProd', payload))
        } else if (context === 'UPDATE') {
            errors.push(...this.nameValidator('name', payload))
            errors.push(...this.descriptionValidator('description', payload))
            errors.push(...this.imageUrlSmallValidator('imageUrlSmall', payload))
            errors.push(...this.startAtValidator('startAt', payload))
            errors.push(...this.endAtValidator('endAt', payload))
            errors.push(...this.skusUpdateValidator('skus', payload))
            errors.push(...this.attributeSaleImagesCreateValidator('attributeSaleImages', payload))
            errors.push(...this.imageUrlLargeValidator('imageUrlLarge', payload))
            errors.push(...this.selectedOptionsValidator('selectedOptions', payload))
            errors.push(...this.attributesKeyValidator('attributesKey', payload))
            errors.push(...this.attributesGenValidator('attributesGen', payload))
            errors.push(...this.attributesProdValidator('attributesProd', payload))
        } else {
            console.error('unsupportted context type :: ' + context)
        }
        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    nameValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(payload[key], 75, results, key);
        StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        return appendCtrlKey(results, this.formId)
    }
    attributesKeyValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        return appendCtrlKey(results, this.formId)
    }
    attributesProdValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(payload[key], results, key)) {

        } else {
            results = []
        }
        return appendCtrlKey(results, this.formId)
    }
    attributesGenValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(payload[key], results, key)) {

        } else {
            results = []
        }
        return appendCtrlKey(results, this.formId)
    }
    selectedOptionsValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(payload[key], results, key)) {
            (payload[key] as IProductOptions[]).forEach((e, index) => {
                StringValidator.hasValue(e.title, results, index + "_title");
                ListValidator.hasValue(e.options, results, index + "_options")
                e.options.forEach((ee, i) => {
                    StringValidator.hasValue(ee.optionValue, results, index + "_" + i + "_optionValue");
                })
            })
        } else {
            results = [];
        }
        return appendCtrlKey(results, 'product_option')
    }

    startAtValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (notNullOrUndefined(payload[key])) {
            NumberValidator.isNumber(payload[key], results, key);
            NumberValidator.isInteger(payload[key], results, key);
        }
        return appendCtrlKey(results, this.formId)
    }
    endAtValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (notNullOrUndefined(payload[key])) {
            NumberValidator.isNumber(payload[key], results, key);
            NumberValidator.isInteger(payload[key], results, key);
        }
        return appendCtrlKey(results, this.formId)
    }
    imageUrlSmallValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key);
        return appendCtrlKey(results, this.formId)
    }
    skusCreateValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        if (Array.isArray(payload[key])) {
            (payload[key] as ISku[]).forEach((e, index) => {
                if ((!e.attributesSales) || e.attributesSales.length == 0) {
                    ListValidator.lengthIs(payload[key], 1, results, key);
                } else {
                    ListValidator.hasValue(e.attributesSales, results, key);
                }
                if (notNullOrUndefined(e.sales)) {
                    NumberValidator.isInteger(e.sales, results, index + '_sales');
                    NumberValidator.greaterThanOrEqualTo(e.price, 0, results, index + '_sales')
                }
                NumberValidator.isNumber(e.price, results, index + '_price');
                NumberValidator.greaterThan(e.price, 0, results, index + '_price')
                NumberValidator.isInteger(e.storageActual, results, index + '_storageActual')
                NumberValidator.greaterThanOrEqualTo(e.storageActual, 0, results, index + '_storageActual')
                NumberValidator.isInteger(e.storageOrder, results, index + '_storageOrder')
                NumberValidator.greaterThanOrEqualTo(e.storageOrder, 0, results, index + '_storageOrder')
                DefaultValidator.notExist(e.decreaseActualStorage, results, index + '_decreaseActualStorage')
                DefaultValidator.notExist(e.decreaseOrderStorage, results, index + '_decreaseOrderStorage')
                DefaultValidator.notExist(e.increaseActualStorage, results, index + '_increaseActualStorage')
                DefaultValidator.notExist(e.increaseOrderStorage, results, index + '_increaseOrderStorage')
            })

        } else {
            results.push({ type: 'skusNotArray', message: 'SKUS_NOT_ARRAY', key: key })
        }
        return appendCtrlKey(results, this.formId)
    }
    skusUpdateValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        if (Array.isArray(payload[key])) {
            (payload[key] as ISku[]).forEach((e, index) => {
                if ((!e.attributesSales) || e.attributesSales.length == 0) {
                    ListValidator.lengthIs(payload[key], 1, results, key);
                } else {
                    ListValidator.hasValue(e.attributesSales, results, 'attributesSales');
                }
                NumberValidator.isNumber(e.price, results, index + '_price');
                NumberValidator.greaterThan(e.price, 0, results, index + '_price')
                if (notNullOrUndefined(e.sales)) {
                    NumberValidator.isInteger(e.sales, results, index + '_sales');
                    NumberValidator.greaterThanOrEqualTo(e.price, 0, results, index + '_sales')
                }
                if (notNullOrUndefined(e.storageActual)) {
                    NumberValidator.isInteger(e.storageActual, results, index + '_storageActual')
                    NumberValidator.greaterThan(e.storageActual, 0, results, index + '_storageActual')
                }
                if (notNullOrUndefined(e.storageOrder)) {
                    NumberValidator.isInteger(e.storageOrder, results, index + '_storageOrder')
                    NumberValidator.greaterThan(e.storageOrder, 0, results, index + '_storageOrder')
                }
                if (notNullOrUndefined(e.decreaseActualStorage)) {
                    NumberValidator.isInteger(e.decreaseActualStorage, results, index + '_decreaseActualStorage')
                    NumberValidator.greaterThan(e.decreaseActualStorage, 0, results, index + '_decreaseActualStorage')
                }
                if (notNullOrUndefined(e.decreaseOrderStorage)) {
                    NumberValidator.isInteger(e.decreaseOrderStorage, results, index + '_decreaseOrderStorage')
                    NumberValidator.greaterThan(e.decreaseOrderStorage, 0, results, index + '_decreaseOrderStorage')
                }
                if (notNullOrUndefined(e.increaseActualStorage)) {
                    NumberValidator.isInteger(e.increaseActualStorage, results, index + '_increaseActualStorage')
                    NumberValidator.greaterThan(e.increaseActualStorage, 0, results, index + '_increaseActualStorage')
                }
                if (notNullOrUndefined(e.increaseOrderStorage)) {
                    NumberValidator.isInteger(e.increaseOrderStorage, results, index + '_increaseOrderStorage')
                    NumberValidator.greaterThan(e.increaseOrderStorage, 0, results, index + '_increaseOrderStorage')
                }
            })

        } else {
            results.push({ type: 'skusNotArray', message: 'SKUS_NOT_ARRAY', key: key })
        }
        return appendCtrlKey(results, this.formId)
    }
    attributeSaleImagesCreateValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(payload[key], results, key)) {
            payload[key].forEach(e => {
                StringValidator.hasValue(e.attributeSales, results, key);
                ListValidator.hasValue(e.imageUrls, results, key)
            })
        } else {
            results = [];
        }
        return appendCtrlKey(results, this.formId)
    }
    imageUrlLargeValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(payload[key], results, key)) {

        } else {
            results = [];
        }
        return appendCtrlKey(results, this.formId)
    }
    descriptionValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (StringValidator.hasValue(payload[key], results, key)) {
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
            results = [];
        }
        return appendCtrlKey(results, this.formId)
    }

}
export function appendCtrlKey(results: ErrorMessage[], id: string) {
    return results.map(e => {
        if (hasValue(e.key) && hasValue(e.formId)) {
            return e
        }
        else {
            return {
                ...e,
                formId: hasValue(e.formId) ? e.formId : id,
            }
        }
    });
}

import { IProductDetail, IProductOptions, ISku } from './interfaze-product';
import { DefaultValidator, ErrorMessage, hasValue, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TValidatorContext } from './validator-common';

export class ProductValidator implements IAggregateValidator {
    private formId: string;
    constructor(formId: string) {
        this.formId = formId;
    }
    public validate(payload: IProductDetail, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
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
        return errors.filter(e => e);
    }
    nameValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
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
        NumberValidator.hasValue(payload[key], results, key);
        return appendCtrlKey(results, this.formId)
    }
    endAtValidator = (key: string, payload: IProductDetail) => {
        let results: ErrorMessage[] = [];
        if (payload[key]) {
            NumberValidator.hasValue(payload[key], results, key);
            NumberValidator.greaterThanOrEqualTo(payload[key], new Date().getTime(), results, key);
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
        (payload[key] as ISku[]).forEach((e, index) => {
            if ((!e.attributesSales) || e.attributesSales.length == 0) {
                ListValidator.lengthIs(payload[key], 1, results, key);
            } else {
                ListValidator.hasValue(e.attributesSales, results, key);
            }

            NumberValidator.hasValue(e.price, results, index + '_price');
            NumberValidator.greaterThan(e.price, 0, results, index + '_price')
            NumberValidator.isInteger(e.storageActual, results, index + '_storageActual')
            NumberValidator.greaterThan(e.storageActual, 0, results, index + '_storageActual')
            NumberValidator.isInteger(e.storageOrder, results, index + '_storageOrder')
            NumberValidator.greaterThan(e.storageOrder, 0, results, index + '_storageOrder')
            DefaultValidator.notExist(e.decreaseActualStorage, results, index + '_decreaseActualStorage')
            DefaultValidator.notExist(e.decreaseOrderStorage, results, index + '_decreaseOrderStorage')
            DefaultValidator.notExist(e.increaseActualStorage, results, index + '_increaseActualStorage')
            DefaultValidator.notExist(e.increaseOrderStorage, results, index + '_increaseOrderStorage')
        })
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
import { IAttrImage, IProductDetail, IProductOptions, ISku } from 'src/app/services/product.service';
import { DefaultValidator, ErrorMessage, hasValue, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TValidator, TValidatorContext, Validator } from './validator-common';

export class ProductValidator implements IAggregateValidator {
    private formId: string;
    public rules = new Map<string, TValidator>();
    constructor(formId: string) {
        this.formId = formId;
        this.rules.set('name', this.nameValidator)
        this.rules.set('description', this.descriptionValidator)
        this.rules.set('imageUrlSmall', this.imageUrlSmallValidator)
        this.rules.set('startAt', this.startAtValidator)
        this.rules.set('endAt', this.endAtValidator)
        this.rules.set('skus', this.skusCreateValidator)
        this.rules.set('attributeSaleImages', this.attributeSaleImagesCreateValidator)
        this.rules.set('imageUrlLarge', this.imageUrlLargeValidator)
        this.rules.set('selectedOptions', this.selectedOptionsValidator)
        this.rules.set('attributesKey', this.attributesKeyValidator)
        this.rules.set('attributesGen', this.attributesGenValidator)
        this.rules.set('attributesProd', this.attributesProdValidator)

    }
    public validate(payload: IProductDetail, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        errors.push(...this.rules.get('name')(payload.name, payload))
        errors.push(...this.rules.get('description')(payload.description))
        errors.push(...this.rules.get('imageUrlSmall')(payload.imageUrlSmall))
        errors.push(...this.rules.get('startAt')(payload.startAt, payload))
        errors.push(...this.rules.get('endAt')(payload.endAt, payload))
        errors.push(...this.rules.get('skus')(payload.skus, payload))
        errors.push(...this.rules.get('attributeSaleImages')(payload.attributeSaleImages))
        errors.push(...this.rules.get('imageUrlLarge')(payload.imageUrlLarge))
        errors.push(...this.rules.get('selectedOptions')(payload.selectedOptions, payload))
        errors.push(...this.rules.get('attributesKey')(payload.attributesKey))
        errors.push(...this.rules.get('attributesGen')(payload.attributesGen))
        errors.push(...this.rules.get('attributesProd')(payload.attributesProd, payload))
        return errors.filter(e => e);
    }
    nameValidator: TValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(value, 50, results);
        StringValidator.greaterThanOrEqualTo(value, 1, results);
        return appendCtrlKey(results, 'name', this.formId)
    }
    attributesKeyValidator: TValidator = (value: string[]) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        return appendCtrlKey(results, 'attributesKey', this.formId)
    }
    attributesProdValidator = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = []
        }
        return appendCtrlKey(results, 'attributesProd', this.formId)
    }
    attributesGenValidator = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = []
        }
        return appendCtrlKey(results, 'attributesGen', this.formId)
    }
    selectedOptionsValidator = (value: IProductOptions[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {
            value.forEach((e, index) => {
                StringValidator.hasValue(e.title, results, index + "_title");
                ListValidator.hasValue(e.options, results, index + "_options")
                e.options.forEach((ee, i) => {
                    StringValidator.hasValue(ee.optionValue, results, index + "_" + i + "_optionValue");
                })
            })
        } else {
            results = [];
        }
        return appendCtrlKey(results, 'selectedOptions', 'product_option')
    }

    startAtValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        NumberValidator.hasValue(value, results);
        return appendCtrlKey(results, 'startAt', this.formId)
    }
    endAtValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        if (value) {
            NumberValidator.hasValue(value, results);
            NumberValidator.greaterThanOrEqualTo(value, new Date().getTime(), results);
        }
        return appendCtrlKey(results, 'endAt', this.formId)
    }
    imageUrlSmallValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(value, results);
        return appendCtrlKey(results, 'imageUrlSmall', this.formId)
    }
    skusCreateValidator = (value: ISku[]) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results)
        value.forEach((e, index) => {
            if ((!e.attributesSales) || e.attributesSales.length == 0) {
                ListValidator.lengthIs(value, 1, results);
            } else {
                ListValidator.hasValue(e.attributesSales, results);
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
        return appendCtrlKey(results, 'sku', this.formId)
    }
    attributeSaleImagesCreateValidator = (value: IAttrImage[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {
            value.forEach(e => {
                StringValidator.hasValue(e.attributeSales, results);
                ListValidator.hasValue(e.imageUrls, results)
            })
        } else {
            results = [];
        }
        return appendCtrlKey(results, 'attributeSaleImages', this.formId)
    }
    imageUrlLargeValidator = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = [];
        }
        return appendCtrlKey(results, 'imageUrlLarge', this.formId)
    }
    descriptionValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        if (StringValidator.hasValue(value, results)) {
            StringValidator.lessThanOrEqualTo(value, 50, results)
        } else {
            results = [];
        }
        return appendCtrlKey(results, 'description', this.formId)
    }

}
export function appendCtrlKey(results: ErrorMessage[], key: string, id: string) {
    return results.map(e => {
        if (hasValue(e.ctrlKey) && hasValue(e.formId)) {
            return e
        }
        else {
            return {
                ...e,
                ctrlKey: hasValue(e.ctrlKey) ? e.ctrlKey : key,
                formId: hasValue(e.formId) ? e.formId : id,
            }
        }
    });
}
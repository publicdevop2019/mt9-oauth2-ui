import { clientRoleList, grantTypeListExt, resourceClientRoleList, scopeList } from 'src/app/form-configs/client.config';
import { grantTypeEnums, IClient } from 'src/app/modules/my-apps/interface/client.interface';
import { IAttrImage, IProductDetail, IProductOptions, ISku } from 'src/app/services/product.service';
import { IAggregateValidator, TValidatorContext, ErrorMessage, Validator, BooleanValidator, ListValidator, StringValidator, NumberValidator, DefaultValidator } from './validator-common';

export class ProductValidator implements IAggregateValidator {
    public rules = new Map<string, Validator>();
    constructor() {
        this.rules.set('name', new ProductNameValidator())
        this.rules.set('description', new ProductDescriptionValidator())
        this.rules.set('imageUrlSmall', new ProductImageUrlSmallValidator())
        this.rules.set('startAt', new ProductStartAtValidator())
        this.rules.set('endAt', new ProductEndAtValidator())
        this.rules.set('skus', new ProductSkusCreateValidator())
        this.rules.set('attributeSaleImages', new ProductAttributeSaleImagesCreateValidator())
        this.rules.set('imageUrlLarge', new ProductImageUrlLargeValidator())
        this.rules.set('selectedOptions', new ProductSelectedOptionsValidator())
        this.rules.set('attributesKey', new ProductAttributesKeyValidator())
        this.rules.set('attributesGen', new ProductAttributesGenValidator())
        this.rules.set('attributesProd', new ProductAttributesProdValidator())

    }
    public validate(payload: IProductDetail, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        errors.push(...this.rules.get('name').validate(payload.name, payload))
        errors.push(...this.rules.get('description').validate(payload.description))
        errors.push(...this.rules.get('imageUrlSmall').validate(payload.imageUrlSmall))
        errors.push(...this.rules.get('startAt').validate(payload.startAt, payload))
        errors.push(...this.rules.get('endAt').validate(payload.endAt, payload))
        errors.push(...this.rules.get('skus').validate(payload.skus, payload))
        errors.push(...this.rules.get('attributeSaleImages').validate(payload.attributeSaleImages))
        errors.push(...this.rules.get('imageUrlLarge').validate(payload.imageUrlLarge))
        errors.push(...this.rules.get('selectedOptions').validate(payload.selectedOptions, payload))
        errors.push(...this.rules.get('attributesKey').validate(payload.attributesKey))
        errors.push(...this.rules.get('attributesGen').validate(payload.attributesGen))
        errors.push(...this.rules.get('attributesProd').validate(payload.attributesProd, payload))


        return errors.filter(e => e);
    }
}
export class ProductNameValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(value, 50, results);
        StringValidator.greaterThanOrEqualTo(value, 1, results);
        return results.map(e => { return { ...e, ctrlKey: "name" } });
    }
}
export class ProductAttributesKeyValidator extends Validator {
    validate = (value: string[]) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        return results.map(e => { return { ...e, ctrlKey: "attributesKey" } });
    }
}
export class ProductAttributesProdValidator extends Validator {
    validate = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = []
        }
        return results.map(e => { return { ...e, ctrlKey: "attributesProd" } });
    }
}
export class ProductAttributesGenValidator extends Validator {
    validate = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = []
        }
        return results.map(e => { return { ...e, ctrlKey: "attributesGen" } });
    }
}
export class ProductSelectedOptionsValidator extends Validator {
    validate = (value: IProductOptions[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {
            value.forEach(e => {
                StringValidator.hasValue(e.title, results);
                ListValidator.hasValue(e.options, results)
                e.options.forEach(ee => {
                    StringValidator.hasValue(ee.optionValue, results);
                })
            })
        } else {
            results = [];
        }
        return results.map(e => { return { ...e, ctrlKey: "selectedOptions" } });
    }
}
export class ProductStartAtValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        NumberValidator.hasValue(value, results);
        return results.map(e => { return { ...e, ctrlKey: "startAt" } });
    }
}
export class ProductEndAtValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        if (value) {
            NumberValidator.hasValue(value, results);
            NumberValidator.greaterThanOrEqualTo(value, new Date().getTime(), results);
        }
        return results.map(e => { return { ...e, ctrlKey: "endAt" } });
    }
}
export class ProductImageUrlSmallValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(value, results);
        return results.map(e => { return { ...e, ctrlKey: "imageUrlSmall" } });
    }
}
export class ProductSkusCreateValidator extends Validator {
    validate = (value: ISku[]) => {
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
        return results.map(e => {
            if (e.ctrlKey) {
                return e
            }
            else {
                return {
                    ...e,
                    ctrlKey: 'sku'
                }
            }
        });
    }
}
export class ProductAttributeSaleImagesCreateValidator extends Validator {
    validate = (value: IAttrImage[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {
            value.forEach(e => {
                StringValidator.hasValue(e.attributeSales, results);
                ListValidator.hasValue(e.imageUrls, results)
            })
        } else {
            results = [];
        }

        return results.map(e => { return { ...e, ctrlKey: "attributeSaleImages" } });
    }
}
export class ProductImageUrlLargeValidator extends Validator {
    validate = (value: string[]) => {
        let results: ErrorMessage[] = [];
        if (ListValidator.hasValue(value, results)) {

        } else {
            results = [];
        }

        return results.map(e => { return { ...e, ctrlKey: "imageUrlLarge" } });
    }
}
export class ProductDescriptionValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        if (StringValidator.hasValue(value, results)) {
            StringValidator.lessThanOrEqualTo(value, 50, results)
        } else {
            results = [];
        }
        return results.map(e => { return { ...e, ctrlKey: "description" } });
    }
}


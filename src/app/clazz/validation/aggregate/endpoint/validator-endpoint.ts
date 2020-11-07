import { IAggregateValidator, TPlatform, TValidator, TValidatorContext, ErrorMessage, StringValidator, ListValidator, notNullOrUndefined, NumberValidator, DefaultValidator, hasValue } from '../../validator-common';
import { HTTP_METHODS, IEndpoint } from './interfaze-endpoint';


export class EndpointValidator implements IAggregateValidator {
    private platform: TPlatform = 'CLIENT';
    private validatorsCreate: Map<string, TValidator> = new Map();
    private validatorsUpdate: Map<string, TValidator> = new Map();
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.validatorsCreate.set('resourceId', this.resourceIdValidator);
        this.validatorsCreate.set('description', this.descriptionValidator);
        this.validatorsCreate.set('path', this.pathValidator);
        this.validatorsCreate.set('method', this.methodValidator);
        this.validatorsCreate.set('expression', this.expressionValidator);
        
        this.validatorsUpdate.set('resourceId', this.resourceIdValidator);
        this.validatorsUpdate.set('description', this.descriptionValidator);
        this.validatorsUpdate.set('path', this.pathValidator);
        this.validatorsUpdate.set('method', this.methodValidator);
        this.validatorsUpdate.set('expression', this.expressionValidator);
    }
    public validate(payload: IEndpoint, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.validatorsCreate.forEach((fn, field) => {
                    errors.push(...fn(field, payload))
                })
            } else if (context === 'UPDATE') {
                this.validatorsUpdate.forEach((fn, field) => {
                    errors.push(...fn(field, payload))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            //fail fast for server
            if (context === 'CREATE') {
                this.validatorsCreate.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, payload).length > 0) {
                            errors = fn(field, payload);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                this.validatorsUpdate.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, payload).length > 0) {
                            errors = fn(field, payload);
                        }
                    }
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }

        }

        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    resourceIdValidator = (key: string, payload: IEndpoint) => {
        let results: ErrorMessage[] = [];
        NumberValidator.isNumber(+payload[key], results, key);
        NumberValidator.isInteger(+payload[key], results, key);
        return results
    }
    pathValidator = (key: string, payload: IEndpoint) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key);
        StringValidator.lessThanOrEqualTo(payload[key], 100, results, key);
        return results
    }
    methodValidator = (key: string, payload: IEndpoint) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key);
        StringValidator.belongsTo(payload[key], HTTP_METHODS.map(e => e.value), results, key);
        return results
    }
    expressionValidator = (key: string, payload: IEndpoint) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key);
        StringValidator.lessThanOrEqualTo(payload[key], 100, results, key);
        return results
    }
    descriptionValidator = (key: string, payload: IEndpoint) => {
        let results: ErrorMessage[] = [];
        if (StringValidator.hasValue(payload[key], results, key)) {
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
            results = [];
        }
        return results
    }

}

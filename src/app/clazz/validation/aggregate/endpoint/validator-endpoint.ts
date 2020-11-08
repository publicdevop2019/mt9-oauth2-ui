import { ErrorMessage, IAggregateValidator, NumberValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { HTTP_METHODS, IEndpoint } from './interfaze-endpoint';


export class EndpointValidator implements IAggregateValidator {
    private platform: TPlatform = 'CLIENT';
    private rootCreateEndpointCommandValidator: Map<string, TValidator> = new Map();
    private rootUpdateEndpointCommandValidator: Map<string, TValidator> = new Map();
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.rootCreateEndpointCommandValidator.set('resourceId', this.resourceIdValidator);
        this.rootCreateEndpointCommandValidator.set('description', this.descriptionValidator);
        this.rootCreateEndpointCommandValidator.set('path', this.pathValidator);
        this.rootCreateEndpointCommandValidator.set('method', this.methodValidator);
        this.rootCreateEndpointCommandValidator.set('expression', this.expressionValidator);
        
        this.rootUpdateEndpointCommandValidator.set('resourceId', this.resourceIdValidator);
        this.rootUpdateEndpointCommandValidator.set('description', this.descriptionValidator);
        this.rootUpdateEndpointCommandValidator.set('path', this.pathValidator);
        this.rootUpdateEndpointCommandValidator.set('method', this.methodValidator);
        this.rootUpdateEndpointCommandValidator.set('expression', this.expressionValidator);
    }
    public validate(payload: IEndpoint, context: string): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.rootCreateEndpointCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, payload))
                })
            } else if (context === 'UPDATE') {
                this.rootUpdateEndpointCommandValidator.forEach((fn, field) => {
                    errors.push(...fn(field, payload))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            //fail fast for server
            if (context === 'CREATE') {
                this.rootCreateEndpointCommandValidator.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, payload).length > 0) {
                            errors = fn(field, payload);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                this.rootUpdateEndpointCommandValidator.forEach((fn, field) => {
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

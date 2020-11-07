import { ErrorMessage, IAggregateValidator, StringValidator, TPlatform, TValidator, TValidatorContext } from '../../validator-common';
import { IResourceOwnerUpdatePwd } from './interfaze-user';

export class UserUpdatePwdValidator implements IAggregateValidator {
    private validator: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.validator.set('password', this.passwordValidator);
        this.validator.set('currentPwd', this.currentPwdValidator);
    }
    public validate(client: IResourceOwnerUpdatePwd, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            this.validator.forEach((fn, field) => {
                errors.push(...fn(field, client))
            })
        } else {
            //fail fast for server
            this.validator.forEach((fn, field) => {
                if (errors.length === 0) {
                    if (fn(field, client).length > 0) {
                        errors = fn(field, client);
                    }
                }
            })
        }
        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    passwordValidator = (key: string, payload: IResourceOwnerUpdatePwd) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        return results
    }
    currentPwdValidator = (key: string, payload: IResourceOwnerUpdatePwd) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        return results
    }
}


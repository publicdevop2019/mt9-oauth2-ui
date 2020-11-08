import { ErrorMessage, IAggregateValidator, NumberValidator, StringValidator, TPlatform, TValidator, TValidatorContext } from '../../validator-common';
import { IForgetPasswordRequest, IPendingResourceOwner, IResourceOwnerUpdatePwd } from './interfaze-user';

export class UserValidator implements IAggregateValidator {
    private appCreatePendingUserCommandValidator: Map<string, TValidator> = new Map();
    private adminUpdateUserCommandValidator: Map<string, TValidator> = new Map();
    private appCreateUserCommandValidator: Map<string, TValidator> = new Map();
    private appForgetUserPasswordCommandValidator: Map<string, TValidator> = new Map();
    private appResetUserPasswordCommandValidator: Map<string, TValidator> = new Map();
    private userUpdatePwdCommandValidator: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.userUpdatePwdCommandValidator.set('password', this.passwordValidator);
        this.userUpdatePwdCommandValidator.set('currentPwd', this.currentPwdValidator);

        this.appCreatePendingUserCommandValidator.set('email', this.emailValidator);
        
        this.appCreateUserCommandValidator.set('email', this.emailValidator);
        this.appCreateUserCommandValidator.set('activationCode', this.activationCodeValidator);
        this.appCreateUserCommandValidator.set('password', this.passwordValidator);

        this.appForgetUserPasswordCommandValidator.set('email', this.emailValidator);

        this.appResetUserPasswordCommandValidator.set('email', this.emailValidator);
        this.appResetUserPasswordCommandValidator.set('token', this.tokenValidator);
        this.appResetUserPasswordCommandValidator.set('newPassword', this.passwordValidator);
    }
    public validate(client: IResourceOwnerUpdatePwd, context: TValidatorContext): ErrorMessage[] {
        return this._validate(client, this.userUpdatePwdCommandValidator)
    }
    private _validate(payload: any, validator: Map<string, TValidator>): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            validator.forEach((fn, field) => {
                errors.push(...fn(field, payload))
            })
        } else {
            //fail fast for server
            validator.forEach((fn, field) => {
                if (errors.length === 0) {
                    if (fn(field, payload).length > 0) {
                        errors = fn(field, payload);
                    }
                }
            })
        }
        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    public validateCreatePending(payload: IPendingResourceOwner): ErrorMessage[] {
        return this._validate(payload, this.appCreatePendingUserCommandValidator)
    }
    public validateCreateUser(payload: IPendingResourceOwner): ErrorMessage[] {
        return this._validate(payload, this.appCreateUserCommandValidator)
    }
    public validateForgetPwd(payload: IForgetPasswordRequest): ErrorMessage[] {
        return this._validate(payload, this.appForgetUserPasswordCommandValidator)
    }
    public validateResetPwd(payload: IForgetPasswordRequest): ErrorMessage[] {
        return this._validate(payload, this.appResetUserPasswordCommandValidator)
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
    emailValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        StringValidator.isEmail(payload[key], results, key)
        return results
    }
    activationCodeValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        NumberValidator.isInteger(+payload[key], results, key)
        NumberValidator.greaterThan(+payload[key],99999, results, key)
        return results
    }
    tokenValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        console.dir(payload)
        console.dir(payload[key])
        console.dir(typeof payload[key])
        StringValidator.hasValue(payload[key], results, key)
        NumberValidator.isInteger(+payload[key], results, key)
        NumberValidator.greaterThan(+payload[key],99999999, results, key)
        return results
    }
}


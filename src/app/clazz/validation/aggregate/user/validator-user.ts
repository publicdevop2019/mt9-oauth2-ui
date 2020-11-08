import { BooleanValidator, ErrorMessage, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TPlatform, TValidator } from '../../validator-common';
import { IForgetPasswordRequest, IPendingResourceOwner, IResourceOwner, IResourceOwnerUpdatePwd, USER_ROLE_ENUM } from './interfaze-user';

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

        this.adminUpdateUserCommandValidator.set('locked', this.lockedValidator);
        this.adminUpdateUserCommandValidator.set('subscription', this.subscriptionValidator);
        this.adminUpdateUserCommandValidator.set('grantedAuthorities', this.grantedAuthoritiesValidator);
    }
    public validate(client: IResourceOwnerUpdatePwd, context: string): ErrorMessage[] {
        if (context === 'adminUpdateUserCommandValidator')
            return this._validate(client, this.adminUpdateUserCommandValidator)
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
    public validateAdminUpdate(payload: IResourceOwner): ErrorMessage[] {
        return this._validate(payload, this.adminUpdateUserCommandValidator)
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
        NumberValidator.greaterThan(+payload[key], 99999, results, key)
        return results
    }
    tokenValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        StringValidator.hasValue(payload[key], results, key)
        NumberValidator.isInteger(+payload[key], results, key)
        NumberValidator.greaterThan(+payload[key], 99999999, results, key)
        return results
    }
    lockedValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(payload[key], results, key)
        return results
    }
    subscriptionValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(payload[key], results, key)
        return results
    }
    grantedAuthoritiesValidator = (key: string, payload: IPendingResourceOwner) => {
        let results: ErrorMessage[] = [];
        ListValidator.isSubListOf(payload[key], ['ROLE_ROOT',...USER_ROLE_ENUM.map(e => e.value)], results, key)
        return results
    }
}


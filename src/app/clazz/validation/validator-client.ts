import { CLIENT_ROLE_LIST, GRANT_TYPE_LIST_EXT, RESOURCE_CLIENT_ROLE_LIST, SCOPE_LIST } from './constant';
import { grantTypeEnums, IClient } from './interfaze-client';
import { BooleanValidator, DefaultValidator, ErrorMessage, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TPlatform, TValidator, TValidatorContext } from './validator-common';

export class ClientValidator implements IAggregateValidator {
    private validators: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.validators.set('name', this.clientNameValidator);
        this.validators.set('description', this.clientDescriptionValidator);
        this.validators.set('hasSecret', this.clientHasSecretValidator);
        this.validators.set('clientSecret', this.clientClientSecretValidator);
        this.validators.set('grantTypeEnums', this.clientGrantTypeValidator);
        this.validators.set('resourceIndicator', this.clientResourceIndicatorValidator);
        this.validators.set('grantedAuthorities', this.clientAuthorityValidator);
        this.validators.set('scopeEnums', this.clientScopeValidator);
        this.validators.set('resourceIds', this.clientResourceIdValidator);
        this.validators.set('accessTokenValiditySeconds', this.clientAccessTokenValiditySecondsValidator);
        this.validators.set('refreshTokenValiditySeconds', this.clientRefreshTokenValiditySecondsValidator);
        this.validators.set('registeredRedirectUri', this.clientRegisteredRedirectUriValidator);
        this.validators.set('autoApprove', this.clientAutoApproveValidator);
    }
    public validate(client: IClient, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            this.validators.forEach((fn, field) => {
                errors.push(...fn(field, client))
            })
        } else {
            //fail fast for server
            this.validators.forEach((fn, field) => {
                if (errors.length === 0) {
                    if (fn(field, client).length > 0) {
                        errors = fn(field, client);
                    }
                }
            })
        }
        return errors.filter((v, i, a) => a.findIndex(t => (t.key === v.key && t.message === v.message && t.type === v.type)) === i);
    }
    clientAutoApproveValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums) {
            if (payload.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
                BooleanValidator.isBoolean(payload[key], results, key);
            } else {
                if (payload[key] === null) {
                } else {
                    results.push({ type: 'autoApproveRequiresAuthorizationCodeGrant', message: 'AUTO_APPROVE_REQUIRES_AUTHORIZATION_CODE_GRANT', key: key })
                }
            }
        } else {
            results.push({ type: 'noGrantTypeEnumsFoundForAutoApprove', message: 'NO_GRANT_TYPE_ENUMS_FOUND_FOR_AUTO_APPROVE', key: key })
        }
        return results
    }
    clientRegisteredRedirectUriValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums) {
            if (payload.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
                ListValidator.hasValue(payload[key], results, key);
            } else {
                if (payload[key]) {
                    results.push({ type: 'redirectUriRequiresAuthorizationCodeGrant', message: 'REDIRECT_URI_REQUIRES_AUTHORIZATION_CODE_GRANT', key: key })
                } else {
                }
            }
        } else {
            results.push({ type: 'noGrantTypeEnumsFoundForRedirectUri', message: 'NO_GRANT_TYPE_ENUMS_FOUND_FOR_REDIRECT_URI', key: key })
        }
        return results
    }
    clientNameValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        DefaultValidator.hasValue(payload[key], results, key)
        StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
        StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        return results
    }
    clientAccessTokenValiditySecondsValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        NumberValidator.isNumber(payload[key], results, key);
        NumberValidator.greaterThanOrEqualTo(payload[key], 120, results, key);
        return results
    }
    clientRefreshTokenValiditySecondsValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums) {
            if (payload.grantTypeEnums.includes(grantTypeEnums.password) && payload.grantTypeEnums.includes(grantTypeEnums.refresh_token)) {
                NumberValidator.isNumber(payload[key], results, key);
                NumberValidator.greaterThanOrEqualTo(payload[key], 120, results, key);
            } else {
                if (payload[key] > 0) {
                    results.push({ type: 'requiresRefreshTokenAndPasswordGrant', message: 'REQUIRES_REFRESH_TOKEN_AND_PASSWORD_GRANT', key: key })
                } else {

                }
            }
        } else {
            results.push({ type: 'noGrantTypeEnumsFoundForRefreshToken', message: 'NO_GRANT_TYPE_ENUMS_FOUND_FOR_REFRESH_TOKEN', key: key })
        }
        return results
    }
    clientResourceIdValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        return results
    }
    clientAuthorityValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        ListValidator.isSubListOf(payload[key], CLIENT_ROLE_LIST.map(e => e.value), results, key);
        return results
    }
    clientScopeValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(payload[key], results, key);
        ListValidator.isSubListOf(payload[key], SCOPE_LIST.map(e => e.value), results, key);
        return results
    }
    clientResourceIndicatorValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(payload[key], results, key);
        if (payload[key] === true) {
            let var0 = RESOURCE_CLIENT_ROLE_LIST.map(e => e.value);
            if (var0.some(e => !payload.grantedAuthorities.includes(e))) {
                results.push({ type: 'resourceIndicatorRequiresRole', message: 'RESOURCE_INDICATOR_REQUIRES_ROLE', key: key })
            }
        }
        return results
    }
    clientGrantTypeValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        let value = payload[key];
        ListValidator.hasValue(value, results, key);
        ListValidator.isSubListOf(value, GRANT_TYPE_LIST_EXT.map(e => e.value), results, key);
        // can only be one of the below cases
        // password
        // password + refresh_token
        // client_credentials
        // authorization_code
        if (Array.isArray(value)) {

            if (value.length === 1 && value[0] === grantTypeEnums.password) { }
            else if (value.length === 1 && value[0] === grantTypeEnums.client_credentials) { }
            else if (value.length === 1 && value[0] === grantTypeEnums.authorization_code) { }
            else if (value.length === 2 && value.includes(grantTypeEnums.password) && value.includes(grantTypeEnums.refresh_token)) { }
            else {
                results.push({ type: 'invalidGrantTypeValue', message: 'INVALID_GRANT_TYPE_VALUE', key: key })
            }
        } else {
            results.push({ type: 'grantTypeNotArray', message: 'GRANT_TYPE_NOT_ARRAY', key: key })
        }
        return results
    }
    clientHasSecretValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(payload[key], results, key)
        return results
    }
    clientClientSecretValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.hasSecret === true) {
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
            StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        } else {
            if (payload[key]) {
                results.push({ type: 'secretRequiresHasSecret', message: 'SECRET_REQUIRES_HAS_SECRET', key: key })
            } else {

            }
        }
        return results
    }
    clientDescriptionValidator = (key: string, payload: any) => {
        let results: ErrorMessage[] = [];
        if (payload[key] !== null && payload[key] !== undefined) {
            StringValidator.hasValue(payload[key], results, key)
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
        }
        return results
    }
}


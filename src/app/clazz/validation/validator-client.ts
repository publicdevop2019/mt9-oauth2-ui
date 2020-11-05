import { CLIENT_ROLE_LIST, GRANT_TYPE_LIST_EXT, RESOURCE_CLIENT_ROLE_LIST, SCOPE_LIST } from './constant';
import { grantTypeEnums, IClient } from './interfaze-client';
import { BooleanValidator, DefaultValidator, ErrorMessage, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TPlatform, TValidator, TValidatorContext } from './validator-common';

export class ClientValidator implements IAggregateValidator {
    private createValidators: Map<string, TValidator> = new Map();
    private updateValidators: Map<string, TValidator> = new Map();
    private platform: TPlatform = 'CLIENT';
    constructor(platform?: TPlatform) {
        if (platform) {
            this.platform = platform;
        }
        this.createValidators.set('name', this.clientNameValidator);
        this.createValidators.set('description', this.clientDescriptionValidator);
        this.createValidators.set('hasSecret', this.clientHasSecretValidator);
        this.createValidators.set('clientSecret', this.clientClientSecretValidator);
        this.createValidators.set('grantTypeEnums', this.clientGrantTypeValidator);
        this.createValidators.set('resourceIndicator', this.clientResourceIndicatorValidator);
        this.createValidators.set('grantedAuthorities', this.clientAuthorityValidator);
        this.createValidators.set('scopeEnums', this.clientScopeValidator);
        this.createValidators.set('resourceIds', this.clientResourceIdValidator);
        this.createValidators.set('accessTokenValiditySeconds', this.clientAccessTokenValiditySecondsValidator);
        this.createValidators.set('refreshTokenValiditySeconds', this.clientRefreshTokenValiditySecondsValidator);
        this.createValidators.set('registeredRedirectUri', this.clientRegisteredRedirectUriValidator);
        this.createValidators.set('autoApprove', this.clientAutoApproveValidator);

        this.updateValidators.set('name', this.clientNameValidator);
        this.updateValidators.set('description', this.clientDescriptionValidator);
        this.updateValidators.set('hasSecret', this.clientHasSecretValidator);
        this.updateValidators.set('clientSecret', this.clientUpdateClientSecretValidator);
        this.updateValidators.set('grantTypeEnums', this.clientGrantTypeValidator);
        this.updateValidators.set('resourceIndicator', this.clientResourceIndicatorValidator);
        this.updateValidators.set('grantedAuthorities', this.clientAuthorityValidator);
        this.updateValidators.set('scopeEnums', this.clientScopeValidator);
        this.updateValidators.set('resourceIds', this.clientResourceIdValidator);
        this.updateValidators.set('accessTokenValiditySeconds', this.clientAccessTokenValiditySecondsValidator);
        this.updateValidators.set('refreshTokenValiditySeconds', this.clientRefreshTokenValiditySecondsValidator);
        this.updateValidators.set('registeredRedirectUri', this.clientRegisteredRedirectUriValidator);
        this.updateValidators.set('autoApprove', this.clientAutoApproveValidator);
    }
    public validate(client: IClient, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        if (this.platform === 'CLIENT') {
            if (context === 'CREATE') {
                this.createValidators.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else if (context === 'UPDATE') {
                this.updateValidators.forEach((fn, field) => {
                    errors.push(...fn(field, client))
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }
        } else {
            if (context === 'CREATE') {
                //fail fast for server
                this.createValidators.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else if (context === 'UPDATE') {
                //fail fast for server
                this.updateValidators.forEach((fn, field) => {
                    if (errors.length === 0) {
                        if (fn(field, client).length > 0) {
                            errors = fn(field, client);
                        }
                    }
                })
            } else {
                console.error('unsupportted context type :: ' + context)
            }

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
        StringValidator.hasValue(payload[key], results, key)
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
        if (ListValidator.hasValue(payload[key], results, key)) {
            (payload[key] as string[]).forEach((e, index) => {
                StringValidator.hasValue(e, results, index + "_" + key)
            })
        } else {
            results = [];
        }
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
    clientUpdateClientSecretValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.hasSecret === true) {
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


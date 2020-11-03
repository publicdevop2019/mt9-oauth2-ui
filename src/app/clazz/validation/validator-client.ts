import { CLIENT_ROLE_LIST, GRANT_TYPE_LIST_EXT, RESOURCE_CLIENT_ROLE_LIST, SCOPE_LIST } from './constant';
import { grantTypeEnums, IClient } from './interfaze-client';
import { BooleanValidator, ErrorMessage, IAggregateValidator, ListValidator, NumberValidator, StringValidator, TValidatorContext } from './validator-common';

export class ClientValidator implements IAggregateValidator {
    constructor() {
    }
    public validate(client: IClient, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        errors.push(...this.clientNameValidator('name', client))
        errors.push(...this.clientDescriptionValidator('description', client))
        errors.push(...this.clientHasSecretValidator('hasSecret', client))
        errors.push(...this.clientClientSecretValidator('clientSecret', client))
        errors.push(...this.clientGrantTypeValidator('grantTypeEnums', client))
        errors.push(...this.clientResourceIndicatorValidator('resourceIndicator', client))
        errors.push(...this.clientAuthorityValidator('grantedAuthorities', client))
        errors.push(...this.clientScopeValidator('scopeEnums', client))
        errors.push(...this.clientResourceIdValidator('resourceIds', client))
        errors.push(...this.clientAccessTokenValiditySecondsValidator('accessTokenValiditySeconds', client))
        errors.push(...this.clientRefreshTokenValiditySecondsValidator('refreshTokenValiditySeconds', client))
        errors.push(...this.clientRegisteredRedirectUriValidator('registeredRedirectUri', client))
        errors.push(...this.clientAutoApproveValidator('autoApprove', client))
        return errors.filter(e => e);
    }
    clientAutoApproveValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            BooleanValidator.isBoolean(payload[key], results, key);
        } else {
            if (payload[key] === null) {
            } else {
                results.push({ type: 'autoApproveRequiresAuthorizationCodeGrant', message: 'AUTO_APPROVE_REQUIRES_AUTHORIZATION_CODE_GRANT', key: key })
            }
        }
        return results
    }
    clientRegisteredRedirectUriValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            ListValidator.hasValue(payload[key], results, key);
        } else {
            if (payload[key]) {
                results.push({ type: 'redirectUriRequiresAuthorizationCodeGrant', message: 'REDIRECT_URI_REQUIRES_AUTHORIZATION_CODE_GRANT', key: key })
            } else {
            }
        }
        return results
    }
    clientNameValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(payload[key], 50, results, key);
        StringValidator.greaterThanOrEqualTo(payload[key], 1, results, key);
        return results
    }
    clientAccessTokenValiditySecondsValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        NumberValidator.hasValue(payload[key], results, key);
        NumberValidator.greaterThanOrEqualTo(payload[key], 120, results, key);
        return results
    }
    clientRefreshTokenValiditySecondsValidator = (key: string, payload: IClient) => {
        let results: ErrorMessage[] = [];
        if (payload.grantTypeEnums.includes(grantTypeEnums.password) && payload.grantTypeEnums.includes(grantTypeEnums.refresh_token)) {
            NumberValidator.hasValue(payload[key], results, key);
            NumberValidator.greaterThanOrEqualTo(payload[key], 120, results, key);
        } else {
            if (payload[key] > 0) {
                results.push({ type: 'requiresRefreshTokenAndPasswordGrant', message: 'REQUIRES_REFRESH_TOKEN_AND_PASSWORD_GRANT', key: key })
            } else {

            }
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
        ListValidator.hasValue(payload[key], results, key);
        ListValidator.isSubListOf(payload[key], GRANT_TYPE_LIST_EXT.map(e => e.value), results, key);
        // can only be one of the below cases
        // password
        // password + refresh_token
        // client_credentials
        // authorization_code
        if (payload[key].length === 1 && payload[key][0] === grantTypeEnums.password) { }
        else if (payload[key].length === 1 && payload[key][0] === grantTypeEnums.client_credentials) { }
        else if (payload[key].length === 1 && payload[key][0] === grantTypeEnums.authorization_code) { }
        else if (payload[key].length === 2 && payload[key].includes(grantTypeEnums.password) && payload[key].includes(grantTypeEnums.refresh_token)) { }
        else {
            results.push({ type: 'invalidGrantTypeValue', message: 'INVALID_GRANT_TYPE_VALUE', key: key })
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
        if (StringValidator.hasValue(payload[key], results, key)) {
            StringValidator.lessThanOrEqualTo(payload[key], 50, results, key)
        } else {
            results = [];
        }
        return results
    }
}


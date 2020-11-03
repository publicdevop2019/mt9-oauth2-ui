import { CLIENT_ROLE_LIST, GRANT_TYPE_LIST_EXT, RESOURCE_CLIENT_ROLE_LIST, SCOPE_LIST } from './constant';
import { grantTypeEnums, IClient } from './interfaze-client';
import { IAggregateValidator, TValidatorContext, ErrorMessage, BooleanValidator, ListValidator, StringValidator, NumberValidator, TValidator } from './validator-common';

export class ClientValidator implements IAggregateValidator {
    public rules = new Map<string, TValidator>();
    constructor() {
        this.rules.set('name', this.clientNameValidator)
        this.rules.set('description', this.clientDescriptionValidator)
        this.rules.set('hasSecret', this.clientHasSecretValidator)
        this.rules.set('clientSecret', this.clientClientSecretValidator)
        this.rules.set('grantType', this.clientGrantTypeValidator)
        this.rules.set('resourceIndicator', this.clientResourceIndicatorValidator)
        this.rules.set('authority', this.clientAuthorityValidator)
        this.rules.set('scope', this.clientScopeValidator)
        this.rules.set('resourceId', this.clientResourceIdValidator)
        this.rules.set('accessTokenValiditySeconds', this.clientAccessTokenValiditySecondsValidator)
        this.rules.set('refreshTokenValiditySeconds', this.clientRefreshTokenValiditySecondsValidator)
        this.rules.set('registeredRedirectUri', this.clientRegisteredRedirectUriValidator)
        this.rules.set('autoApprove', this.clientAutoApproveValidator)
    }
    public validate(client: IClient, context: TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        errors.push(...this.rules.get('name')(client.name))
        errors.push(...this.rules.get('description')(client.description))
        errors.push(...this.rules.get('hasSecret')(client.hasSecret))
        errors.push(...this.rules.get('clientSecret')(client.clientSecret, client))
        errors.push(...this.rules.get('grantType')(client.grantTypeEnums))
        errors.push(...this.rules.get('resourceIndicator')(client.resourceIndicator, client))
        errors.push(...this.rules.get('authority')(client.grantedAuthorities))
        errors.push(...this.rules.get('scope')(client.scopeEnums))
        errors.push(...this.rules.get('resourceId')(client.resourceIds))
        errors.push(...this.rules.get('accessTokenValiditySeconds')(client.accessTokenValiditySeconds))
        errors.push(...this.rules.get('refreshTokenValiditySeconds')(client.refreshTokenValiditySeconds, client))
        errors.push(...this.rules.get('registeredRedirectUri')(client.registeredRedirectUri, client))
        errors.push(...this.rules.get('autoApprove')(client.autoApprove, client))
        return errors.filter(e => e);
    }
    clientAutoApproveValidator = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            BooleanValidator.isBoolean(value, results);
        } else {
            if (value === null) {
            } else {
                results.push({ type: 'autoApproveRequiresAuthorizationCodeGrant', message: 'AUTO_APPROVE_REQUIRES_AUTHORIZATION_CODE_GRANT' })
            }
        }
        return results.map(e => { return { ...e, key: "autoApprove" } });
    }
    clientRegisteredRedirectUriValidator = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            ListValidator.hasValue(value, results);
        } else {
            if (value) {
                results.push({ type: 'redirectUriRequiresAuthorizationCodeGrant', message: 'REDIRECT_URI_REQUIRES_AUTHORIZATION_CODE_GRANT' })
            } else {
            }
        }
        return results.map(e => { return { ...e, key: "registeredRedirectUri" } });
    }
    clientNameValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(value, 50, results);
        StringValidator.greaterThanOrEqualTo(value, 1, results);
        return results.map(e => { return { ...e, key: "name" } });
    }
    clientAccessTokenValiditySecondsValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        NumberValidator.hasValue(value, results);
        NumberValidator.greaterThanOrEqualTo(value, 120, results);
        return results.map(e => { return { ...e, key: "accessTokenValiditySeconds" } });
    }
    clientRefreshTokenValiditySecondsValidator = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.grantTypeEnums.includes(grantTypeEnums.password) && client.grantTypeEnums.includes(grantTypeEnums.refresh_token)) {
            NumberValidator.hasValue(value, results);
            NumberValidator.greaterThanOrEqualTo(value, 120, results);
        } else {
            if (value > 0) {
                results.push({ type: 'requiresRefreshTokenAndPasswordGrant', message: 'REQUIRES_REFRESH_TOKEN_AND_PASSWORD_GRANT' })
            } else {

            }
        }
        return results.map(e => { return { ...e, key: "refreshTokenValiditySeconds" } });
    }
    clientResourceIdValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        return results.map(e => { return { ...e, key: "resourceId" } });
    }
    clientAuthorityValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, CLIENT_ROLE_LIST.map(e => e.value), results);
        return results.map(e => { return { ...e, key: "authority" } });
    }
    clientScopeValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, SCOPE_LIST.map(e => e.value), results);
        return results.map(e => { return { ...e, key: "scope" } });
    }
    clientResourceIndicatorValidator = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(value, results);
        if (value === true) {
            let var0 = RESOURCE_CLIENT_ROLE_LIST.map(e => e.value);
            if (var0.some(e => !client.grantedAuthorities.includes(e))) {
                results.push({ type: 'resourceIndicatorRequiresRole', message: 'RESOURCE_INDICATOR_REQUIRES_ROLE' })
            }
        }
        return results.map(e => { return { ...e, key: "resourceIndicator" } });
    }
    clientGrantTypeValidator = (value: string[]) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, GRANT_TYPE_LIST_EXT.map(e => e.value), results);
        // can only be one of the below cases
        // password
        // password + refresh_token
        // client_credentials
        // authorization_code
        if (value.length === 1 && value[0] === grantTypeEnums.password) { }
        else if (value.length === 1 && value[0] === grantTypeEnums.client_credentials) { }
        else if (value.length === 1 && value[0] === grantTypeEnums.authorization_code) { }
        else if (value.length === 2 && value.includes(grantTypeEnums.password) && value.includes(grantTypeEnums.refresh_token)) { }
        else {
            results.push({ type: 'invalidGrantTypeValue', message: 'INVALID_GRANT_TYPE_VALUE' })
        }
        return results.map(e => { return { ...e, key: "grantType" } });
    }
    clientHasSecretValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(value, results)
        return results.map(e => { return { ...e, key: "hasSecret" } });
    }
    clientClientSecretValidator = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.hasSecret === true) {
            StringValidator.lessThanOrEqualTo(value, 50, results);
            StringValidator.greaterThanOrEqualTo(value, 1, results);
        } else {
            if (value) {
                results.push({ type: 'secretRequiresHasSecret', message: 'SECRET_REQUIRES_HAS_SECRET' })
            } else {

            }
        }
        return results.map(e => { return { ...e, key: "clientSecret" } });
    }
    clientDescriptionValidator = (value: any) => {
        let results: ErrorMessage[] = [];
        if (StringValidator.hasValue(value, results)) {
            StringValidator.lessThanOrEqualTo(value, 50, results)
        } else {
            results = [];
        }
        return results.map(e => { return { ...e, key: "description" } });
    }
}


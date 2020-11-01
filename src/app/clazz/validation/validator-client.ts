import { clientRoleList, grantTypeListExt, resourceClientRoleList, scopeList } from 'src/app/form-configs/client.config';
import { grantTypeEnums, IClient } from 'src/app/modules/my-apps/interface/client.interface';
import { IAggregateValidator, TValidatorContext, ErrorMessage, Validator, BooleanValidator, ListValidator, StringValidator, NumberValidator } from './validator-common';

export class ClientValidator implements IAggregateValidator {
    public rules = new Map<string, Validator>();
    constructor() {
        this.rules.set('name', new ClientNameValidator())
        this.rules.set('description', new ClientDescriptionValidator())
        this.rules.set('hasSecret', new ClientHasSecretValidator())
        this.rules.set('clientSecret', new ClientClientSecretValidator())
        this.rules.set('grantType', new ClientGrantTypeValidator())
        this.rules.set('resourceIndicator', new ClientResourceIndicatorValidator())
        this.rules.set('authority', new ClientAuthorityValidator())
        this.rules.set('scope', new ClientScopeValidator())
        this.rules.set('resourceId', new ClientResourceIdValidator())
        this.rules.set('accessTokenValiditySeconds', new ClientAccessTokenValiditySecondsValidator())
        this.rules.set('refreshTokenValiditySeconds', new ClientRefreshTokenValiditySecondsValidator())
        this.rules.set('registeredRedirectUri', new ClientRegisteredRedirectUriValidator())
        this.rules.set('autoApprove', new ClientAutoApproveValidator())
    }
    public validate(client: IClient,context:TValidatorContext): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        errors.push(...this.rules.get('name').validate(client.name))
        errors.push(...this.rules.get('description').validate(client.description))
        errors.push(...this.rules.get('hasSecret').validate(client.hasSecret))
        errors.push(...this.rules.get('clientSecret').validate(client.clientSecret, client))
        errors.push(...this.rules.get('grantType').validate(client.grantTypeEnums))
        errors.push(...this.rules.get('resourceIndicator').validate(client.resourceIndicator, client))
        errors.push(...this.rules.get('authority').validate(client.grantedAuthorities))
        errors.push(...this.rules.get('scope').validate(client.scopeEnums))
        errors.push(...this.rules.get('resourceId').validate(client.resourceIds))
        errors.push(...this.rules.get('accessTokenValiditySeconds').validate(client.accessTokenValiditySeconds))
        errors.push(...this.rules.get('refreshTokenValiditySeconds').validate(client.refreshTokenValiditySeconds, client))
        errors.push(...this.rules.get('registeredRedirectUri').validate(client.registeredRedirectUri, client))
        errors.push(...this.rules.get('autoApprove').validate(client.autoApprove, client))
        return errors.filter(e => e);
    }
}
export class ClientAutoApproveValidator extends Validator {
    validate = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            BooleanValidator.isBoolean(value, results);
        } else {
            if (value === null) {
            } else {
                results.push({ type: 'autoApproveRequiresAuthorizationCodeGrant', message: 'AUTO_APPROVE_REQUIRES_AUTHORIZATION_CODE_GRANT' })
            }
        }
        return results.map(e => { return { ...e, ctrlKey: "autoApprove" } });
    }
}
export class ClientRegisteredRedirectUriValidator extends Validator {
    validate = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        if (client.grantTypeEnums.includes(grantTypeEnums.authorization_code)) {
            ListValidator.hasValue(value, results);
        } else {
            if (value) {
                results.push({ type: 'redirectUriRequiresAuthorizationCodeGrant', message: 'REDIRECT_URI_REQUIRES_AUTHORIZATION_CODE_GRANT' })
            } else {
            }
        }
        return results.map(e => { return { ...e, ctrlKey: "registeredRedirectUri" } });
    }
}
export class ClientNameValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        StringValidator.lessThanOrEqualTo(value, 50, results);
        StringValidator.greaterThanOrEqualTo(value, 1, results);
        return results.map(e => { return { ...e, ctrlKey: "name" } });
    }
}
export class ClientAccessTokenValiditySecondsValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        NumberValidator.hasValue(value, results);
        NumberValidator.greaterThanOrEqualTo(value, 120, results);
        return results.map(e => { return { ...e, ctrlKey: "accessTokenValiditySeconds" } });
    }
}
export class ClientRefreshTokenValiditySecondsValidator extends Validator {
    validate = (value: any, client: IClient) => {
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
        return results.map(e => { return { ...e, ctrlKey: "refreshTokenValiditySeconds" } });
    }
}
export class ClientResourceIdValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        return results.map(e => { return { ...e, ctrlKey: "resourceId" } });
    }
}
export class ClientAuthorityValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, clientRoleList.map(e => e.value), results);
        return results.map(e => { return { ...e, ctrlKey: "authority" } });
    }
}
export class ClientScopeValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, scopeList.map(e => e.value), results);
        return results.map(e => { return { ...e, ctrlKey: "scope" } });
    }
}
export class ClientResourceIndicatorValidator extends Validator {
    validate = (value: any, client: IClient) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(value, results);
        if (value === true) {
            let var0 = resourceClientRoleList.map(e => e.value);
            if (var0.some(e => !client.grantedAuthorities.includes(e))) {
                results.push({ type: 'resourceIndicatorRequiresRole', message: 'RESOURCE_INDICATOR_REQUIRES_ROLE' })
            }
        }
        return results.map(e => { return { ...e, ctrlKey: "resourceIndicator" } });
    }
}
export class ClientGrantTypeValidator extends Validator {
    validate = (value: string[]) => {
        let results: ErrorMessage[] = [];
        ListValidator.hasValue(value, results);
        ListValidator.isSubListOf(value, grantTypeListExt.map(e => e.value), results);
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
        return results.map(e => { return { ...e, ctrlKey: "grantType" } });
    }
}
export class ClientHasSecretValidator extends Validator {
    validate = (value: any) => {
        let results: ErrorMessage[] = [];
        BooleanValidator.isBoolean(value, results)
        return results.map(e => { return { ...e, ctrlKey: "hasSecret" } });
    }
}
export class ClientClientSecretValidator extends Validator {
    validate = (value: any, client: IClient) => {
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
        return results.map(e => { return { ...e, ctrlKey: "clientSecret" } });
    }
}
export class ClientDescriptionValidator extends Validator {
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


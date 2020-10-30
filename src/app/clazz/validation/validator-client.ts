import { IClient } from 'src/app/modules/my-apps/interface/client.interface';
export interface ErrorMessage {
    type: string,
    ctrlKey: string
    message?: string
}
export class ClientValidator {
    public static validate(client: IClient): ErrorMessage[] {
        let erros: ErrorMessage[] = [];
        erros.push(DefaultValidator.notNull(client['name'], 'name'))
        erros.push(DefaultValidator.notUndefined(client['name'], 'name'))
        erros.push(StringValidator.isString(client['name'], 'name'))
        erros.push(StringValidator.notEmptyString(client['name'], 'name'))
        erros.push(StringValidator.lessThanOrEqualTo(client['name'], 50, 'name'))
        erros.push(StringValidator.greaterThanOrEqualTo(client['name'], 1, 'name'))
        return erros.filter(e => e);
    }
    public static validateField(key: string, value: string): ErrorMessage[] {
        let erros: ErrorMessage[] = [];
        erros.push(DefaultValidator.notNull(value, key))
        erros.push(DefaultValidator.notUndefined(value, key))
        erros.push(StringValidator.isString(value, key))
        erros.push(StringValidator.notEmptyString(value, key))
        erros.push(StringValidator.lessThanOrEqualTo(value, 50, key))
        erros.push(StringValidator.greaterThanOrEqualTo(value, 1, key))
        return erros.filter(e => e);
    }

}
export class StringValidator {
    public static greaterThanOrEqualTo(var0: string, arg1: number, key: string): ErrorMessage {
        if (var0.length < arg1)
            return { type: "greaterThanOrEqualTo", message: 'GREATER_THAN_OR_EQUAL_TO', ctrlKey: key }
    }
    public static lessThanOrEqualTo(var0: string, arg1: number, key: string): ErrorMessage {
        if (var0.length > arg1)
            return { type: "lessThanOrEqualTo", message: 'LESS_THAN_OR_EQUAL_TO', ctrlKey: key }
    }
    public static isString(var0: string, key: string): ErrorMessage {
        if (typeof var0 !== 'string')
            return { type: "typeMatch", message: 'TYPE_MATCH', ctrlKey: key }
    }
    public static lessThan(var0: string, length: number, key: string): ErrorMessage {
        if (var0.length >= length)
            return { type: "lessThan", message: 'LESS_THAN', ctrlKey: key }
    }
    public static greaterThan(var0: string, length: number, key: string): ErrorMessage {
        if (var0.length <= length)
            return { type: "greaterThan", message: 'GREATER_THAN', ctrlKey: key }
    }
    public static notEmptyString(var0: string | undefined | null, key: string): ErrorMessage {
        if (var0 === '')
            return { type: "notEmptyString", message: 'NOT_EMPTY_STRING', ctrlKey: key }
    }
}
export class DefaultValidator {
    public static notNull(var0: string | undefined | null, key: string): ErrorMessage {
        if (var0 === null)
            return { type: "notNull", message: 'NOT_NULL', ctrlKey: key }
    }
    public static notUndefined(var0: string | undefined | null, key: string): ErrorMessage {
        if (var0 === undefined)
            return { type: "notUndefined", message: 'NOT_UNDEFINED', ctrlKey: key }
    }
}

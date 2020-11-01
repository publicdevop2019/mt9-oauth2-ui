export type TValidatorContext = 'CREATE' | 'UPDATE' | 'DELETE'
export interface ErrorMessage {
    type: string,
    ctrlKey?: string
    message?: string
}
export abstract class Validator {
    validate: (value: any, payload?: any) => ErrorMessage[];
}
export interface IAggregateValidator {
    validate: (payload: any, context: TValidatorContext) => ErrorMessage[];
}
export class StringValidator {
    public static greaterThanOrEqualTo(var0: string, arg1: number, results: ErrorMessage[]): boolean {
        if (var0.length < arg1 || typeof var0 !== 'string') {
            results.push({ type: "greaterThanOrEqualTo", message: 'STRING_GREATER_THAN_OR_EQUAL_TO' })
            return false
        } else {
            return true
        }
    }
    public static lessThanOrEqualTo(var0: string, arg1: number, results: ErrorMessage[]): boolean {
        if (var0.length > arg1 || typeof var0 !== 'string') {
            results.push({ type: "lessThanOrEqualTo", message: 'STRING_LESS_THAN_OR_EQUAL_TO' });
            return false
        } else {
            return true
        }
    }
    public static isString(var0: string, results: ErrorMessage[]): boolean {
        if (typeof var0 !== 'string') {
            results.push({ type: "typeMatch", message: 'STRING_TYPE_MATCH' })
            return false
        } else {
            return true
        }
    }
    public static lessThan(var0: string, length: number, results: ErrorMessage[]): boolean {
        if (var0.length >= length || typeof var0 !== 'string') {
            results.push({ type: "lessThan", message: 'STRING_LESS_THAN' })
            return false
        } else {
            return true
        }
    }
    public static greaterThan(var0: string, length: number, results: ErrorMessage[]): boolean {
        if (var0.length <= length || typeof var0 !== 'string') {
            results.push({ type: "greaterThan", message: 'STRING_GREATER_THAN' })
            return false
        } else {
            return true
        }
    }
    public static notEmpty(var0: string | undefined | null, results: ErrorMessage[]): boolean {
        if (var0 === '' || typeof var0 !== 'string') {
            results.push({ type: "notEmptyString", message: 'STRING_NOT_EMPTY_STRING' })
            return false;
        } else {
            return true;
        }
    }
    public static hasValue(var0: string | undefined | null, results: ErrorMessage[]): boolean {
        if (var0 === undefined || var0 === null || var0 === '' || typeof var0 !== 'string') {
            results.push({ type: "hasStringValue", message: 'STRING_HAS_VALUE' })
            return false;
        } else {
            return true;
        }
    }
}
export class DefaultValidator {
    public static notNull(var0: string | undefined | null, results: ErrorMessage[]): boolean {
        if (var0 === null) {
            results.push({ type: "notNull", message: 'NOT_NULL' })
            return false;
        } else {
            return true;
        }
    }
    public static notUndefined(var0: string | undefined | null, results: ErrorMessage[]): boolean {
        if (var0 === undefined) {
            results.push({ type: "notUndefined", message: 'NOT_UNDEFINED' })
            return false;
        } else {
            return true;
        }
    }
}
export class BooleanValidator {
    public static isBoolean(var0: boolean | undefined | null, results: ErrorMessage[]): boolean {
        if (typeof var0 !== 'boolean') {
            results.push({ type: "isBoolean", message: 'IS_BOOLEAN' })
            return false;
        } else {
            return true;
        }
    }
    public static isTrue(var0: boolean | undefined | null, results: ErrorMessage[]): boolean {
        if (typeof var0 !== 'boolean' || var0 !== true) {
            results.push({ type: "isTrue", message: 'IS_TRUE' })
            return false;
        } else {
            return true;
        }
    }
    public static isFalse(var0: boolean | undefined | null, results: ErrorMessage[]): boolean {
        if (typeof var0 !== 'boolean' || var0 !== true) {
            results.push({ type: "isFalse", message: 'IS_FALSE' })
            return false;
        } else {
            return true;
        }
    }
}
export class ListValidator {
    public static belongsTo(var0: string, list: string[], results: ErrorMessage[]): boolean {
        if (list.length === 0 || typeof list[0] !== typeof var0 || !list.includes(var0)) {
            results.push({ type: "belongsTo", message: 'LIST_BELONGS_TO' })
            return false;
        } else {
            return true;
        }
    }
    public static isSubListOf(var0: string[], list: string[], results: ErrorMessage[]): boolean {
        if (list.length === 0 || (typeof list !== typeof var0) || var0.some(e => !list.includes(e))) {
            results.push({ type: "isSubListOf", message: 'LIST_IS_SUB_LIST_OF' })
            return false;
        } else {
            return true;
        }
    }
    public static hasValue(var0: string[], results: ErrorMessage[]): boolean {
        if (var0 === undefined || var0 === null || var0.length === 0) {
            results.push({ type: "notEmpty", message: 'LIST_NOT_EMPTY' })
            return false;
        } else {
            return true;
        }
    }
}
export class NumberValidator {
    public static hasValue(var0: any, results: ErrorMessage[]): boolean {
        if (var0 === undefined || var0 === null || typeof var0 !== 'number') {
            results.push({ type: "hasValue", message: 'NUMBER_HAS_VALUE' })
            return false;
        } else {
            return true;
        }
    }
    public static greaterThan(var0: any, var1: number, results: ErrorMessage[]): boolean {
        if (var0 <= var1) {
            results.push({ type: "greaterThan", message: 'NUMBER_GREATER_THAN' })
            return false;
        } else {
            return true;
        }
    }
    public static greaterThanOrEqualTo(var0: any, var1: number, results: ErrorMessage[]): boolean {
        if (var0 < var1) {
            results.push({ type: "greaterThanOrEqualTo", message: 'NUMBER_GREATER_THAN_OREQUAL_TO' })
            return false;
        } else {
            return true;
        }
    }
    public static lessThan(var0: any, var1: number, results: ErrorMessage[]): boolean {
        if (var0 >= var1) {
            results.push({ type: "lessThan", message: 'NUMBER_LESS_THAN' })
            return false;
        } else {
            return true;
        }
    }
    public static lessThanOrEqualTo(var0: any, var1: number, results: ErrorMessage[]): boolean {
        if (var0 > var1) {
            results.push({ type: "lessThanOrEqualTo", message: 'NUMBER_LESS_THAN_OR_EQUAL_TO' })
            return false;
        } else {
            return true;
        }
    }
}
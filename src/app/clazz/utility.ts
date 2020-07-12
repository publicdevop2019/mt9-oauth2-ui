import { IAttribute } from '../services/attribute.service';

export function getCookie(name: string): string {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
export function hasValue(input: any): boolean {
    return input !== null && input !== undefined;
}
export function getLabel(e: IAttribute): string {
    let lableNew:string[]=[];
    lableNew.push(e.name)
    if (e.description) {
        lableNew.push(e.description)
    }
    if (e.selectValues) {
        lableNew.push(e.selectValues.join(','))
    }
    return lableNew.join(' - ')
}
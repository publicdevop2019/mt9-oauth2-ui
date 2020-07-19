import { IBizAttribute } from '../services/attribute.service';
import { ICatalogCustomer } from '../services/catalog.service';

export function getCookie(name: string): string {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
export function hasValue(input: any): boolean {
    return input !== null && input !== undefined;
}
export function getLabel(e: IBizAttribute): string {
    let lableNew: string[] = [];
    lableNew.push(e.name)
    if (e.description) {
        lableNew.push(e.description)
    }
    if (e.selectValues) {
        lableNew.push(e.selectValues.join(','))
    }
    return lableNew.join(' - ')
}
export function getLayeredLabel(attr: ICatalogCustomer, es: ICatalogCustomer[]): string {
    let tags: string[] = [];
    tags.push(attr.name);
    while (attr.parentId !== null && attr.parentId !== undefined) {
        let nextId = attr.parentId;
        attr = es.find(e => e.id === nextId);
        tags.push(attr.name);
    }
    return tags.reverse().join(' / ')
}
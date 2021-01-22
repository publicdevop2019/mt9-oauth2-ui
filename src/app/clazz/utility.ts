import { IBizAttribute } from './validation/aggregate/attribute/interfaze-attribute';
import { ICatalog } from './validation/aggregate/catalog/interfaze-catalog';

export function getCookie(name: string): string {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
export function logout() {
    sessionStorage.clear();
    localStorage.removeItem('jwt');
    document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"
    window.location.assign('/login')
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
export function getLayeredLabel(attr: ICatalog, es: ICatalog[]): string {
    let tags: string[] = [];
    tags.push(attr.name);
    while (attr.parentId !== null && attr.parentId !== undefined) {
        let nextId = attr.parentId;
        attr = es.find(e => e.id === nextId);
        tags.push(attr.name);
    }
    return tags.reverse().join(' / ')
}
export function parseAttributePayload(input: string[], attrList: IBizAttribute[]) {
    let parsed = {};
    input.forEach((attr, index) => {
        let selected = attrList.find(e => String(e.id) === attr.split(':')[0]);
        if (index === 0) {
            parsed['attributeId'] = selected.id;
            if (selected.method === 'SELECT') {
                parsed['attributeValueSelect'] = attr.split(':')[1];
            } else {
                parsed['attributeValueManual'] = attr.split(':')[1];
            }
        } else {
            parsed['attributeId_' + (index - 1)] = selected.id;
            if (selected.method === 'SELECT') {
                parsed['attributeValueSelect_' + (index - 1)] = attr.split(':')[1];
            } else {
                parsed['attributeValueManual_' + (index - 1)] = attr.split(':')[1];
            }
        }
    })
    return parsed;
}
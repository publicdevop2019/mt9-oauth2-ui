import { IIdName } from 'mt-form-builder/lib/classes/template.interface';

export interface ICatalog extends IIdName{
    parentId?: number,
    attributes?: string[],
    catalogType?: 'BACKEND' | 'FRONTEND',
    version:number
  }
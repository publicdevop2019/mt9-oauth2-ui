import { IIdName } from "src/app/components/editable-page-select-single/editable-page-select-single.component";

export interface ICatalog extends IIdName{
    parentId?: string,
    attributes?: string[],
    catalogType?: 'BACKEND' | 'FRONTEND',
    version:number
  }
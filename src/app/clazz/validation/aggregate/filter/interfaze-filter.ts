export interface IFilterItem {
    id: number,
    name: string,
    values: string[]
  }
  export interface IBizFilter {
    id: number,
    catalogs: string[],
    description?:string
    filters: IFilterItem[]
    version:number;
  }
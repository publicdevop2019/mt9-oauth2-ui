export interface ICatalog {
    id: number,
    name: string,
    parentId?: number,
    attributes?: string[],
    catalogType?: 'BACKEND' | 'FRONTEND',
    version:number
  }
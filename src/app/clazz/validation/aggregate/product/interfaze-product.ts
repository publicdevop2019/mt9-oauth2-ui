
export interface IProductSimple {
    id: number;
    name: string;
    endAt: number;
    startAt: number;
    attributesKey: string[];
    priceList: number[];
    totalSales: number;
    coverImage: string;
    attrSalesMap: { [key: string]: number }
    version:number;
  }
  export interface IProductOptions {
    title: string;
    options: IProductOption[];
  }
  export interface IProductOption {
    optionValue: string;
    priceVar?: string;
  }
  export interface ISku {
    attributesSales: string[];
    storageOrder?: number;
    storageActual?: number;
    price: number;
    sales?: number;
    increaseOrderStorage?: number;
    decreaseOrderStorage?: number;
    increaseActualStorage?: number;
    decreaseActualStorage?: number;
  }
  export interface ISkuNew {
    id: number
    referenceId: string,
    description: string,
    storageOrder: number;
    storageActual: number;
    price: number;
    sales: number;
    version:number;
  }
  export interface IProductDetail {
    id: number;
    name: string;
    imageUrlSmall: string;
    description: string;
    attributesKey: string[];
    imageUrlLarge?: string[];
    selectedOptions?: IProductOptions[];
    attributesProd?: string[];
    attributesGen?: string[];
    attributeSaleImages?: IAttrImage[]
    skus: ISku[];
    endAt?: number,
    startAt?: number,
    lowestPrice?: number;
    totaleSales?: number;
    version:number;
  }
  export interface IAttrImage {
    attributeSales: string,
    imageUrls: string[]
  }
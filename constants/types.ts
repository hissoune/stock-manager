export type Warehouseman = {
    id:string,
    name:string,
    dob:string
    secretKey:string
    warehouseId:number
}

export type Statistics = {
    totalProducts:number,
    outOfStock:number,
    totalStockValue:number,
    mostAddedProducts:string[],
    mostRemovedProducts:string[]
   }

  export type stoke ={
    id:number,
    name:string,
    quantity:number,
    localisation:{
        city:string,
        latitude:number,
        longitude:number
  }
}

  export type editedBy ={
    warehousemanId:number,
    at:Date
  }


    export type Product = {
     
        id: string;
        name: string;
        type: string;
        barcode: string;
        price: number;
        solde: number;
        supplier: string;
        image: string;
        warehouseId: number;
        stocks: stoke[];
        editedBy: editedBy[];
       }
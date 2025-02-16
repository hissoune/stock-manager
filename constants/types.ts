export type Warehouseman = {
    id:string,
    name:string,
    dob:string,
    city:string
    image:string
    secretKey:string
    warehouseId:number
}

export type  Statistics = {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: [
      {
          productId: string,
          productName:string,
          addedCount: number,
          lastAddedAt: Date
        }
  ];
  mostRemovedProducts: [
      {
          productId: string,
          productName:string,
          removedCount: number,
          lastRemovedAt: Date
        }
  ];
}

  export type stok ={
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
        price: string;
        solde: string;
        supplier: string;
        image: string | null ;
        stocks: stok[];
        editedBy: editedBy[];
       }
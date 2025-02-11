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


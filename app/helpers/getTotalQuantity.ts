import { stok } from "@/constants/types";



export const getTotalQuantity = (stocks: stok[]) => {
    return stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  };
import { getTotalQuantity } from '@/app/helpers/getTotalQuantity';
import { Product, stok } from '../../../constants/types';
import {  updateMostRemovedProducts } from './statisticsApi';


export const getProducts = async () => {
  try {
     const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  const data = await response.json();
  return data;
  } catch (error) {
     throw new Error("Failed to get products : Internal Server Error")
  }
 
}
export const UpdateQuantity = async (type: string, productId: string | undefined, stokId: number, warehousemanId: number) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  const product = await response.json();

  let updatedStocks = []
  if (product) {
    switch (type) {

      case 'add':
        updatedStocks = product.stocks.map((stock: stok) =>
          stock.id === stokId ? { ...stock, quantity: stock.quantity + 1 } : stock
        );
        break;
      case 'remove':
        updatedStocks = product.stocks.map((stock: stok) =>
          stock.id === stokId && stock.quantity > 0 ? { ...stock, quantity: stock.quantity - 1 } : stock
        );
        break;
    }
  }

  const updatedProduct = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stocks: updatedStocks, editedBy: [ { warehousemanId: warehousemanId, at: new Date().toISOString().split("T")[0] }] })
  });
 
  const newProduct = await updatedProduct.json()
  return newProduct ;
}

export const updateInputQuantity = async (Quantity: number, productId: string | undefined, stokId: number, warehousemanId: number) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

  const product = await response.json();


  const updatedStocks = product.stocks.map((stock: stok) =>
    stock.id === stokId ? { ...stock, quantity: Quantity } : stock
  );

  const updatedProduct = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stocks: updatedStocks, editedBy: [...product.editedBy, { warehousemanId: warehousemanId, at: new Date().toISOString().split("T")[0] }] })
  });
  return updatedProduct.json();
}


export const displayEditedBy = async (productId: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

  const product = await response.json();
  if (!product) {
    throw new Error('product ?????')
  }

  const warehouseMan = (await fetch(`${process.env.EXPO_PUBLIC_URL}/warehousemans/${product.editedBy[0].warehousemanId}`)).json();

  return warehouseMan;

}


export const getStocks = async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data = await response.json();


  if (!data) {
    throw new Error("No products found");
  }

  const uniqueStocks = new Map();

  data.forEach((product: { stocks: stok[] }) => {
    product.stocks.forEach((stock) => {
      if (!uniqueStocks.has(stock.id)) {
        uniqueStocks.set(stock.id, stock);
      }
    });
  });

  return Array.from(uniqueStocks.values());
};



export const createProduct = async (product: Product) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updates: Product) => {

  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.statusText}`);
  }
   const updatedProduct = await response.json();

  return updatedProduct
}


export const getProductByBarcode = async (barcode: string) => {

  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products?barcode=${barcode}`);

  const products = await response.json();
  if (!products) {
    throw new Error('product ?????')
  }

  return products[0];
}

export const searchForProducts = async (searchQuery: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await response.json();

  return products.filter((product: any) =>
    ["name", "supplier", "type"].some((key) =>
      product[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
};

export const filterBy = async (key: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  let products = await response.json();

  switch (key) {
    case "Quantity":
      products.sort((a: any, b: any) => getTotalQuantity(a.stocks) - getTotalQuantity(b.stocks));
      break;

    case "Price":
      products.sort((a: any, b: any) => b.price - a.price);
      break;

    case "type":
      products.sort((a: any, b: any) => a.type.localeCompare(b.type));
      break;

    default:
      console.warn("Invalid filter key");
  }

  return products;
};

export const clearStoks = async (productId:string,warehousemanId: number)=>{
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

 const  product = await response.json();


const updatedStocks = product.stocks.map((stock: stok) => ({ ...stock, quantity: 0 }));

const updatedProduct = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ stocks: updatedStocks, editedBy: [...product.editedBy, { warehousemanId: warehousemanId, at: new Date().toISOString().split("T")[0] }] })
});

await updateMostRemovedProducts(productId, product.name);
return updatedProduct.json();
 
}






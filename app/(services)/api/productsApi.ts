import { Product, stok, editedBy } from '../../../constants/types';


export const getProducts = async () => {

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
}
export const UpdateQuantity = async (type: string, productId: string | undefined, stokId: number, warehousemanId: number) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

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
    await updateMostAddedProducts(data.id,data.name)
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
   await updateMostAddedProducts(updatedProduct.id,updatedProduct.name)

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
      products.sort((a: any, b: any) => a.quantity - b.quantity);
      break;

    case "Price":
      products.sort((a: any, b: any) => a.price - b.price);
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


const updateMostRemovedProducts = async (productId: string, productName: string) => {
  try {
    const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`);
    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
    }
    const statistics = await statsResponse.json();

    if (!statistics || typeof statistics !== 'object') {
      throw new Error("Invalid statistics data");
    }

    if (!Array.isArray(statistics.mostRemovedProducts)) {
      statistics.mostRemovedProducts = [];
    }

    const existingProductIndex = statistics.mostRemovedProducts.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      statistics.mostRemovedProducts[existingProductIndex].removedCount += 1;
      statistics.mostRemovedProducts[existingProductIndex].lastRemovedAt = new Date().toLocaleString();
    } else {
      statistics.mostRemovedProducts.push({
        productId,
        productName,
        removedCount: 1,
        lastRemovedAt : new Date().toLocaleString()
      });
    }
    statistics.mostRemovedProducts.sort((a: any, b: any) => b.removedCount - a.removedCount);

    statistics.mostRemovedProducts = statistics.mostRemovedProducts.slice(0, 10);

    const updateStatsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statistics),
    });

    if (!updateStatsResponse.ok) {
      throw new Error(`Failed to update statistics: ${updateStatsResponse.statusText}`);
    }

    return await updateStatsResponse.json();
  } catch (error) {
    console.error("Error updating most removed products:", error);
    throw error;
  }
};


const updateMostAddedProducts = async (productId: string, productName: string) => {
  try {
    const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`);
    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
    }
    const statistics = await statsResponse.json();

    if (!statistics || typeof statistics !== 'object') {
      throw new Error("Invalid statistics data");
    }

    if (!Array.isArray(statistics.mostAddedProducts)) {
      statistics.mostAddedProducts = [];
    }

    const currentTime = new Date().toLocaleString(); 

    const existingProductIndex = statistics.mostAddedProducts.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      statistics.mostAddedProducts[existingProductIndex].addedCount += 1;
      statistics.mostAddedProducts[existingProductIndex].lastAddedAt = currentTime;
    } else {
      statistics.mostAddedProducts.push({
        productId,
        productName,
        addedCount: 1,
        lastAddedAt: currentTime
      });
    }

    statistics.mostAddedProducts.sort((a: any, b: any) => b.addedCount - a.addedCount);

    statistics.mostAddedProducts = statistics.mostAddedProducts.slice(0, 10);

    const updateStatsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statistics),
    });

    if (!updateStatsResponse.ok) {
      throw new Error(`Failed to update statistics: ${updateStatsResponse.statusText}`);
    }

    return await updateStatsResponse.json();
  } catch (error) {
    console.error("Error updating most added products:", error);
    throw error;
  }
};
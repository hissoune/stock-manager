import { Product, stok } from "@/constants/types";



export const getStatistics = async () => {

  try {
  const [productsResponse, statsResponse] = await Promise.all([
    fetch(`${process.env.EXPO_PUBLIC_URL}/products`),
    fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`),
  ]);

  if (!productsResponse.ok || !statsResponse.ok) {
    throw new Error("Failed to fetch data");
  }

  const products: Product[] = await productsResponse.json();
  const statistics = await statsResponse.json();

  if (!statistics || typeof statistics !== "object") {
    throw new Error("Invalid statistics data");
  }

  const getProductDetails = (productId: string) => products.find((product) => product.id === productId);

  statistics.mostAddedProducts = (statistics.mostAddedProducts || []).map((item: any) => ({
    ...item,
    product: getProductDetails(item.productId),
  }));

  statistics.mostRemovedProducts = (statistics.mostRemovedProducts || []).map((item: any) => ({
    ...item,
    product: getProductDetails(item.productId),
  }));

  return statistics;
} catch (error) {
  console.error("Error fetching statistics with products:", error);
  throw error;
}
   
}


export const updateMostAddedProducts = async (productId: string, productName: string) => {
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


  export const updateMostRemovedProducts = async (productId: string, productName: string) => {
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
  
     
    } catch (error) {
      console.error("Error updating most removed products:", error);
      throw error;
    }
  };


  export const updateTotalProducts = async () =>{
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`);

        const products = await response.json();
      
        const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
        }
        const statistics = await statsResponse.json();
      
        if (!statistics || typeof statistics !== 'object') {
          throw new Error("Invalid statistics data");
        }

        const updateStatsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...statistics,totalProducts:products.length}),
          });
      
          if (!updateStatsResponse.ok) {
            throw new Error(`Failed to update statistics: ${updateStatsResponse.statusText}`);
          }


    } catch (error) {
        console.error("Error updating most removed products:", error);
        throw error;
    }
   


  };


  export const updateOutOfStock = async ()=>{


    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`);

        const products = await response.json();
      
        const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
        }
        const statistics = await statsResponse.json();
      
        if (!statistics || typeof statistics !== 'object') {
          throw new Error("Invalid statistics data");
        }

        let totalOutOfStock = products.filter((product: Product) =>
            product.stocks.some((stock) => stock.quantity === 0)
        ).length;

       
        
        const updateStatsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...statistics,outOfStock:totalOutOfStock}),
          });
      
          if (!updateStatsResponse.ok) {
            throw new Error(`Failed to update statistics: ${updateStatsResponse.statusText}`);
          }


    } catch (error) {
        console.error("Error updating most removed products:", error);
        throw error;
    }
   

  };

  export const updateTotalStockValue =async ()=>{
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`);

        const products = await response.json();
      
        const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch statistics: ${statsResponse.statusText}`);
        }
        const statistics = await statsResponse.json();
      
        if (!statistics || typeof statistics !== 'object') {
          throw new Error("Invalid statistics data");
        }

       

         const totalValueStock =  products.flatMap((product: Product) => product.stocks)
        .reduce((sum:number, stock:stok) => sum + stock.quantity, 0);

       
        
        const updateStatsResponse = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...statistics,totalStockValue:totalValueStock}),
          });
      
          if (!updateStatsResponse.ok) {
            throw new Error(`Failed to update statistics: ${updateStatsResponse.statusText}`);
          }


    } catch (error) {
        console.error("Error updating total value stock:", error);
        throw error;
    }
  }
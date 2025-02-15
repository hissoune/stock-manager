


export const getStatistics = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/statistics`,
        {method:"GET",
        headers:{
            "Content-Type":"application/json",
        }
    }
    );
    const data = await response.json();
    return data;
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
   


  }
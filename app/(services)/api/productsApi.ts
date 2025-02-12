import { Product, stok } from '../../../constants/types';


export  const getProducts = async () => {

    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products`,
        {method:"GET",
        headers:{
            "Content-Type":"application/json",
        }
    }
    );
    const data = await response.json();
    return data;
}
   export const UpdateQuantity = async (type:string,productId:string|undefined,stokId:number,warehousemanId:number)=>{



            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

            const product =await response.json();

            let updatedStocks=[]
             if (product) {
                switch (type){
              
                    case 'add':
                        updatedStocks = product.stocks.map((stock:stok) => 
                            stock.id === stokId ? { ...stock, quantity: stock.quantity + 1 } : stock
                          );
                     break;
                     case 'remove':
                        updatedStocks = product.stocks.map((stock:stok) => 
                            stock.id === stokId ? { ...stock, quantity:stock.quantity -1 } : stock
                          );
                          break;
                  }
             }
             
             const updatedProduct = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`,{
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stocks: updatedStocks ,editedBy:{warehousemanId:warehousemanId,at:new Date().toISOString().split("T")[0]}})
             });
                return updatedProduct.json();
   }


   export const displayEditedBy = async (productId:string)=>{
    const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/products/${productId}`);

            const product =await response.json();
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
  
  
    if (!data ) {
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
  

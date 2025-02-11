import { stok } from '../../../constants/types';


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
   export const UpdateQuantity = async (type:string,productId:string|undefined,stokId:number)=>{

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
                body: JSON.stringify({ stocks: updatedStocks })
             });
                return updatedProduct.json();
   }
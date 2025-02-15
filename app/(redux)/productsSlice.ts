import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearStoks, createProduct, displayEditedBy, filterBy, getProductByBarcode, getProducts, getStocks, searchForProducts, updateInputQuantity, updateProduct, UpdateQuantity } from "../(services)/api/productsApi";
import {  Product, stok, Warehouseman } from "@/constants/types";


export const loadProducts = createAsyncThunk(
    "products/loadProducts",
    async ()=>{
        const response = await getProducts();
        return response;
    }
);

export const updateQuantity =createAsyncThunk(
    "products/stoks/duantity",
    async ({ type, productId, stokId,warehousemanId }: { type: string; productId: string|undefined; stokId: number,warehousemanId:number }) => {
        
        const updatedProduct = await UpdateQuantity(type, productId, stokId,warehousemanId);
        console.log(updatedProduct);
        
        return updatedProduct;
      
        
    }
);

export const displayEditedByAction = createAsyncThunk(
    "products/warehouseman",
    async (productId:string)=>{
        const warehouseMan = await displayEditedBy(productId);
        return warehouseMan;
    }

);

export const getStocksAction = createAsyncThunk(
    "products/stokes",
    async ()=>{
        const stoks = await getStocks();
        
        return stoks
    }
);

export const createProductAction = createAsyncThunk(
    "products/create",
    async (product:Product)=>{
        const Product = await createProduct(product);
        return Product;
    }
);
export const updateProductAction = createAsyncThunk<Product, { productId: string, updates: Product }>(
    "products/update",
    async ({ productId, updates })=>{
        
        const product = await updateProduct(productId, updates);
        return product;
    }

);

export const getProductByBarcodeActopn = createAsyncThunk(
    "products/scaned details",
    async (barcode:string)=>{
        
    const product = await getProductByBarcode(barcode);    
    return product;
    }
);
export const searchForProductsAction = createAsyncThunk(
    "products/search",
    async (searchQuery:string)=>{
        
        const products = await searchForProducts(searchQuery);
        return products;
    }
);
export const filterByAction = createAsyncThunk(
    "products/filter",
    async (key:string)=>{
        const products = await filterBy(key);
        return products;
    }
);

export const updateInputQuantityAction = createAsyncThunk(
    "products/InputChange",
    async ({ Quantity, productId, stokId,warehousemanId }: { Quantity: number; productId: string|undefined; stokId: number,warehousemanId:number })=>{
       const product = await updateInputQuantity(Quantity, productId, stokId, warehousemanId);
       console.log(product);
       
       return product;
    }
);

export const clearStoksAction = createAsyncThunk(
    "products/clearStok",
    async ({ productId, warehousemanId }: { productId: string, warehousemanId: number })=>{
        const product = await clearStoks(productId, warehousemanId);
        return product;
    }
);



const intialState :{
    products:Product[] | null;
    product:Product | null;
    lastEditer:Warehouseman | null ,
    stoks:stok[];
    isLoadind:boolean;
    error:string | null;
}={
    products:[],
    product:null,
    lastEditer:null,
    stoks:[],
    isLoadind:false,
    error:null,
}

const productSlice = createSlice({
    name: "products",
    initialState: intialState,
    reducers: { 
        loadProduct: (state, action:PayloadAction<Product>)=>{
            state.product=action.payload;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(loadProducts.pending, (state)=>{
            state.isLoadind=true;
        })
        .addCase(loadProducts.fulfilled, (state, action)=>{ 
            state.products=action.payload;
            state.isLoadind=false;
        })
        .addCase(loadProducts.rejected, (state)=>{
            state.isLoadind=false;
            state.error="Error";
        })
        .addCase(updateQuantity.pending, (state)=>{
            state.isLoadind= false
        })
        .addCase(updateQuantity.fulfilled, (state,action)=>{
            state.isLoadind =false;
            state.product = action.payload;
        })
        .addCase(updateQuantity.rejected, (state)=>{
            state.error = "error while updating the stoke "
        })
        .addCase(displayEditedByAction.pending, (state)=>{
            state.isLoadind = false
        })
        .addCase(displayEditedByAction.fulfilled,(state,action)=>{
           
            state.lastEditer =action.payload;
            state.isLoadind = false;
        })
        .addCase(displayEditedByAction.rejected, (state)=>{
            state.error = "last editor jjj ?????"
        })
        .addCase(getStocksAction.pending, (state)=>{
            state.isLoadind = true
        })
        .addCase(getStocksAction.fulfilled, (state,action)=>{
            state.isLoadind = false ,
            state.stoks = action.payload
        })
        .addCase(getStocksAction.rejected, (state)=>{
            state.error = 'okay §§ hh'
        })
        .addCase(createProductAction.pending,(state)=>{
            state.isLoadind = true
        })
        .addCase(createProductAction.fulfilled, (state,action)=>{
            if (action.payload) {
                state.products?.push(action.payload);
            }
            state.isLoadind = false;
        })
        .addCase(createProductAction.rejected, (state)=>{
            state.error = "d'accord c'est noté"
        })
        .addCase(getProductByBarcodeActopn.pending, (state)=>{
            state.isLoadind = true;
        })
        .addCase(getProductByBarcodeActopn.fulfilled, (state,action)=>{           
            state.product = { ...action.payload }
            state.isLoadind = false;

        })
        .addCase(getProductByBarcodeActopn.rejected, (state)=>{
            state.isLoadind = false;
            state.error = "problem with the barcode "
        })
        
        .addCase(searchForProductsAction.fulfilled, (state,action)=>{
            
            state.products = action.payload;
            state.isLoadind = false
        })
        .addCase(searchForProductsAction.rejected, state=>{
            state.error = "nooo products"
        })
        .addCase(filterByAction.fulfilled, (state,action)=>{
            
            state.products = action.payload;
            state.isLoadind = false
        })
        .addCase(filterByAction.rejected, state=>{
            state.error = "nooo products"
        })
        .addCase(updateProductAction.pending, (state)=>{
            state.isLoadind = true;
        })
        .addCase(updateProductAction.fulfilled, (state,action)=>{
            state.product = action.payload
            state.isLoadind=false
        })
        .addCase(updateProductAction.rejected, (state)=>{
            state.error = "cant update the product "
        })
        .addCase(updateInputQuantityAction.pending, (state)=>{
            state.isLoadind = true
        })
        .addCase(updateInputQuantityAction.fulfilled, (state,action)=>{
            state.product = action.payload;
            state.isLoadind= false;

        })
        .addCase(updateInputQuantityAction.rejected, (state)=>{
            state.isLoadind = false
        })
        .addCase(clearStoksAction.pending, (state)=>{
            state.isLoadind = true
        })
        .addCase(clearStoksAction.fulfilled, (state,action)=>{
            state.product = action.payload;
            state.isLoadind= false;

        })
        .addCase(clearStoksAction.rejected, (state)=>{
            state.isLoadind = false
        })
    },
})
export const { loadProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
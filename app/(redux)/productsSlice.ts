import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProducts, UpdateQuantity } from "../(services)/api/productsApi";
import { Product } from "@/constants/types";


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
        return updatedProduct;
      
        
    }
);

const intialState :{
    products:Product[] | null;
    product:Product | null;
    isLoadind:boolean;
    error:string | null;
}={
    products:[],
    product:null,
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
    },
})
export const { loadProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { displayEditedBy, getProducts, getStocks, UpdateQuantity } from "../(services)/api/productsApi";
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
            state.isLoadind = true
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
    },
})
export const { loadProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
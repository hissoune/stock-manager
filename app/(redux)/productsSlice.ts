import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../(services)/api/productsApi";
import { Product } from "@/constants/types";


export const loadProducts = createAsyncThunk(
    "products/loadProducts",
    async ()=>{
        const response = await getProducts();
        return response;
    }
);

const intialState :{
    products:Product[] | null;
    isLoadind:boolean;
    error:string | null;
}={
    products:null,
    isLoadind:false,
    error:null,
}

const productSlice = createSlice({
    name: "products",
    initialState: intialState,
    reducers: { },
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
    },
})

export const productReducer = productSlice.reducer;
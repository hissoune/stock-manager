

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStatistics, updateOutOfStock, updateTotalProducts, updateTotalStockValue } from "../(services)/api/statisticsApi";
import { Statistics } from "@/constants/types";



export const loadStatistics = createAsyncThunk(
    "statistics/loadStatistics",
    async ()=>{
        await updateTotalProducts()
        await updateOutOfStock()
        await updateTotalStockValue()
        const response = await getStatistics();
        return response;
    }
);

const intialState :{
    statistics:Statistics | null;
isLoadind:boolean;
error:string | null;
}={
    statistics:null,
    isLoadind:false,
    error:null,
}

const SttisticsSlice = createSlice({
    name: "statistics",
    initialState: intialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
        .addCase(loadStatistics.pending, (state)=>{
            state.isLoadind=true;
        })
        .addCase(loadStatistics.fulfilled, (state, action)=>{ 
            state.statistics=action.payload;
            state.isLoadind=false;
        })
        .addCase(loadStatistics.rejected, (state)=>{
            state.isLoadind=false;
            state.error="Error";
        })
    }
});

export const SttisticsReducer = SttisticsSlice.reducer;
  

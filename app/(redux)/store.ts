
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { Statistics } from '../../constants/types';
import { SttisticsReducer } from "./statisticsSlice";
import { productReducer } from "./productsSlice";


const store = configureStore({
    reducer:{
        auth:authReducer,
        stats:SttisticsReducer,
        products:productReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
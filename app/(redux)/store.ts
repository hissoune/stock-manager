
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { Statistics } from '../../constants/types';
import { SttisticsReducer } from "./statisticsSlice";


const store = configureStore({
    reducer:{
        auth:authReducer,
        stats:SttisticsReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
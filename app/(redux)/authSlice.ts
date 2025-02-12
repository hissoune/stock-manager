import { Warehouseman } from "@/constants/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../(services)/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginAction = createAsyncThunk(
    "auth/login",
    async (secretKey: string)=>{
     const warehouseman= await login(secretKey);
     return warehouseman;
    }
);
export const logoutAction = createAsyncThunk(
    "auth/logout",
    async ()=>{
        AsyncStorage.removeItem("warehouseman");
    }
);

export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async ()=>{
        const warehouseman= await AsyncStorage.getItem("warehouseman");
           
           
        return warehouseman ? JSON.parse(warehouseman):null;
    }
)

const initialState: {
    warehouseman: Warehouseman | null;
    isLoading: boolean;
    isAuthenticated:boolean;
    error: string | null;
  } = {
    warehouseman: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  };
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { },
    extraReducers: (builder) => {
      builder
        .addCase(loginAction.pending, (state)=>{
            state.isLoading=true;
        })
        .addCase(loginAction.fulfilled, (state, action)=>{
            state.warehouseman=action.payload;
            AsyncStorage.setItem("warehouseman",JSON.stringify(action.payload))
            state.isLoading=false;
            state.isAuthenticated=true;
        })
        .addCase(loginAction.rejected, (state)=>{
            state.isLoading=false;
            state.error="Invalid secret key";
        })
        .addCase(logoutAction.pending, (state)=>{
            state.isLoading=true;
        })
        .addCase(logoutAction.fulfilled, (state)=>{
            state.warehouseman=null;
            AsyncStorage.removeItem("warehouseman");
            state.isLoading=false;
            state.isAuthenticated=false;
        })
        .addCase(loadUser.pending, (state)=>{
            state.isLoading=true;
        })
        .addCase(loadUser.fulfilled, (state, action)=>{
            if (action.payload != null){
                state.warehouseman=action.payload;
                state.isAuthenticated=true;
                state.isLoading=false;

            }else {
                 state.warehouseman=null;
            state.isLoading=false;
            }
           
           
          
          
        })
        .addCase(loadUser.rejected, (state)=>{
            state.isLoading=false;
        })
    },
  });
  

  export const authReducer = authSlice.reducer;
  
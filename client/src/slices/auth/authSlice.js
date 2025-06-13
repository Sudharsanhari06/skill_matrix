import {createSlice} from '@reduxjs/toolkit';

// const token=localStorage.getItem('token');

const initialState={
    user: null,     
    token:null,    
    loading: false,  
    error: null,
}
export const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
       loginStart:(state)=>{
        state.loading=true;
        state.error=null;
       },
       loginSuccess:(state,action)=>{
        state.loading=false;
        state.user=action.payload.user;
        console.log("redux user",action.payload.user)
        state.token=action.payload.token;
       },
       loginFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
       },
       logout:(state)=>{
        state.user=null;
        state.token = null;
       }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/auth/authSlice';
import employeeReducer from '../slices/employeeSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // employees: employeeReducer
    }
})
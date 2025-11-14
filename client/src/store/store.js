import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice/index.js'
import AdminProductsSlice from './admin/products-slice/index.js'


const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,
    },
})



export default store


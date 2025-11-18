import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice/index.js'
import AdminProductsSlice from './admin/products-slice/index.js'
import shopProductSlice from './shop/products-slice/index.js'


const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,
        shoppingProducts: shopProductSlice,
    },
})



export default store


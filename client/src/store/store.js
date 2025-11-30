import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice/index.js'
import AdminProductsSlice from './admin/products-slice/index.js'
import adminOrderSlice from './admin/order-slice/index.js'
import shopProductSlice from './shop/products-slice/index.js'
import shoppingCartSlice from './shop/cart-slice/index.js'
import shopAddressSlice from './shop/address-slice/index.js'
import shopOrderSlice from './shop/order-slice/index.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,
        adminOrder: adminOrderSlice,
        shoppingProducts: shopProductSlice,
        shopCart: shoppingCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
    },
})



export default store


import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice/index.js'
import AdminProductsSlice from './admin/products-slice/index.js'
import adminOrderSlice from './admin/order-slice/index.js'
import adminDashboardSlice from './admin/dashboard-slice/index.js'
import shopProductSlice from './shop/products-slice/index.js'
import shoppingCartSlice from './shop/cart-slice/index.js'
import shopAddressSlice from './shop/address-slice/index.js'
import shopOrderSlice from './shop/order-slice/index.js'
import searchSlice from './shop/search-slice/index.js'
import reviewSlice from './shop/review-slice/index.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: AdminProductsSlice,
        adminOrder: adminOrderSlice,
        adminDashboard: adminDashboardSlice,
        shoppingProducts: shopProductSlice,
        shopCart: shoppingCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: searchSlice,
        shopReview: reviewSlice,
    },
})



export default store


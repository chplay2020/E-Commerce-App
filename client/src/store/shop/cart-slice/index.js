import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    cartItems: [],
    error: null
}

// Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk('/cart/addToCart',
    async ({ userId, productId, quantity }) => {
        const response = await axios.post(`http://localhost:5000/api/shop/cart/add`,
            {
                userId,
                productId,
                quantity
            }
        )
        return response?.data;
    }
)

// Lấy danh sách giỏ hàng
export const fetchCartItems = createAsyncThunk('/cart/fetchCartItems',
    async (userId) => {
        const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`)
        return response?.data;
    }
)

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartQuantity = createAsyncThunk('/cart/updateCartQuantity',
    async ({ userId, productId, quantity }) => {
        const response = await axios.put(`http://localhost:5000/api/shop/cart/update-cart`,
            {
                userId,
                productId,
                quantity
            }
        )
        return response?.data;
    }
)

// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItem = createAsyncThunk('/cart/deleteCartItem',
    async ({ userId, productId }) => {
        const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`)
        return response?.data;
    }
)

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {
        // Reset giỏ hàng
        resetCart: (state) => {
            state.cartItems = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý addToCart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Xử lý fetchCartItems
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.cartItems = [];
            })

            // Xử lý updateCartQuantity
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Xử lý deleteCartItem
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
})

export const { resetCart } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
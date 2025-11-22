import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    productList: [],
    error: null,
    productDetails: null
}


export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchallproducts',
    async ({ filterParams, sortParams }) => {
        console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

        const query = new URLSearchParams(
            {
                ...filterParams,
                sortBy: sortParams
            }
        );

        const result = await axios.get(`http://localhost:5000/api/shop/products/get?${query.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Result data:", result.data);

        return result?.data;
    }
)


export const fetchProductDetails = createAsyncThunk('/products/fetchproductdetails',
    async (id) => {
        console.log(fetchProductDetails, "fetchProductDetails");

        const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return result?.data;
    }
)


const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
        resetProductDetails: (state) => {
            state.productDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling fetchAllFilteredProducts actions
            .addCase(fetchAllFilteredProducts.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                console.log("Action payload:", action.payload);
                state.isLoading = false;
                state.productList = action.payload.products;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.productList = [];
            })
            // Handling fetchProductDetails actions
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.productDetails = null;
            })
    }
})

export const { resetProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
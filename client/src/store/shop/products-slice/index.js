import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    productList: [],
    error: null,
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


const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
    }
})

export default shoppingProductSlice.reducer;
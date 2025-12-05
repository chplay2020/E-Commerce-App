import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    isLoading: false,
    error: null,
    searchResults: []
}

export const getSearchDetails = createAsyncThunk(
    "/order/getSearchDetails",
    async (keyword) => {
        const response = await axios.get(
            `http://localhost:5000/api/shop/search/${keyword}`
        );

        return response.data;
    }
);

const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        resetSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSearchDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSearchDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload.data;
            })
            .addCase(getSearchDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
})

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
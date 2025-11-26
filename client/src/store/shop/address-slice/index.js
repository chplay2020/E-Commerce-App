import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    addressList: [],
};

export const addNewAddress = createAsyncThunk("/address/addNewAddress", async (formData) => {
    const response = await axios.post(
        'http://localhost:5000/api/shop/address/add',
        formData
    );
    return response.data;
})

export const fetchAllAddresses = createAsyncThunk("/address/fetchAllAddresses", async (userId) => {
    const response = await axios.get(
        `http://localhost:5000/api/shop/address/get/${userId}`
    );
    return response.data;
})

export const editAddress = createAsyncThunk("/address/editAddress", async ({ userId, addressID, formData }) => {
    const response = await axios.put(
        `http://localhost:5000/api/shop/address/update/${userId}/${addressID}`,
        formData
    );
    return response.data;
})

export const deleteAddress = createAsyncThunk("/address/deleteAddress", async ({ userId, addressID }) => {
    const response = await axios.delete(
        `http://localhost:5000/api/shop/address/delete/${userId}/${addressID}`,
    );
    return { ...response.data, addressID };
})

const addressSlice = createSlice({
    name: 'shopAddress',
    initialState,
    reducers: {
        setAddressList(state, action) {
            state.addressList = action.payload;
        },
        resetAddresses(state) {
            state.isLoading = false;
            state.addressList = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Add New Address
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.addressList.push(action.payload.data);
                }
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
            })

            // Fetch All Addresses
            .addCase(fetchAllAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllAddresses.rejected, (state) => {
                state.isLoading = false;
                state.addressList = [];
            })

            // Edit Address
            .addCase(editAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    const index = state.addressList.findIndex(
                        addr => addr._id === action.payload.data._id
                    );
                    if (index !== -1) {
                        state.addressList[index] = action.payload.data;
                    }
                }
            })
            .addCase(editAddress.rejected, (state) => {
                state.isLoading = false;
            })

            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.addressList = state.addressList.filter(
                        addr => addr._id !== action.payload.addressID
                    );
                }
            })
            .addCase(deleteAddress.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

export const { setAddressList, resetAddresses } = addressSlice.actions;

export default addressSlice.reducer;
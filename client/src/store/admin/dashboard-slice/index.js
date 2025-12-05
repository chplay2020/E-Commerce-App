import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    dashboardStats: null,
    error: null
};

export const fetchDashboardStats = createAsyncThunk(
    '/admin/dashboard/fetchStats',
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/stats`);
        return response.data;
    }
);

const adminDashboardSlice = createSlice({
    name: 'adminDashboard',
    initialState,
    reducers: {
        resetDashboardStats: (state) => {
            state.dashboardStats = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboardStats = action.payload.data;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { resetDashboardStats } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;

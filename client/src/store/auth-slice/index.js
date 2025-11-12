import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/register',
                formData,
                { withCredentials: true }
            )
            return response.data  // trả về dữ liệu thành công
        } catch (error) {
            // Trả về thông điệp lỗi từ backend (nếu có)
            return rejectWithValue(error.response?.data || { message: "Registration failed" })
        }
    }
)


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                formData,
                { withCredentials: true }
            )
            return response.data  // trả về dữ liệu thành công
        } catch (error) {
            // Trả về thông điệp lỗi từ backend (nếu có)
            return rejectWithValue(error.response?.data || { message: "Login failed" })
        }
    }
)



export const checkAuth = createAsyncThunk(
    'auth/checkauth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/auth/check-auth',
                {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    }
                }
            )
            return response.data  // trả về dữ liệu thành công
        } catch (error) {
            // Trả về thông điệp lỗi từ backend (nếu có)
            return rejectWithValue(error.response?.data || { message: "Registration failed" })
        }
    }
)




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            //   state.user = action.payload
            //   state.isAuthenticated = true
        },
    },
    extraReducers: (builder) => {
        builder

            // register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
            })

            // login user
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user // Lưu thông tin người dùng từ payload
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
            })

            // check auth
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user // Lưu thông tin người dùng từ payload
                state.isAuthenticated = true
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
            })
    }
})


export const { setUser } = authSlice.actions

export default authSlice.reducer
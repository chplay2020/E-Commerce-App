import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AuthLayout from "./components/auth/layout"

import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"

import ShoppingLayout from "./components/shopping-view/layout"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingAccount from "./pages/shopping-view/account"
import NotFound from "./pages/not-found/index"

import CheckAuth from "./components/common/check-auth"

import UnauthPage from "./pages/unauth-page/index"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import './index.css'

function App() {
  const isAuthenticated = false; // Thay thế bằng logic xác thực thực tế
  const user = {
    name: "John Doe",
    role: "user" // hoặc 'admin'
  };

  return (
    // sau khi fix
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-white">

      <Routes>
        {/* auth routes */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* admin routes */}
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* shopping routes */}
        <Route path="/shopping" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        <Route path="*" element={<NotFound />} /> {/* 404 route */}

        <Route path="/unauth-page" element={<UnauthPage />} /> {/* Unauthorized access route */}
      </Routes>

    </div>
  )
}

export default App

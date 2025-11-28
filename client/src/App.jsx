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
import PayPalReturnPage from "./pages/shopping-view/paypal-return"
import PayPalCancelPage from "./pages/shopping-view/paypal-cancel"

import CheckAuth from "./components/common/check-auth"
import ScrollToTop from "./components/common/scroll-to-top"

import UnauthPage from "./pages/unauth-page/index"
import { checkAuth } from "./store/auth-slice/index.js"

import { useDispatch } from "react-redux"

import { Skeleton } from "./components/ui/skeleton"

import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import './index.css'
import { useSelector } from "react-redux"

function App() {

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (isLoading) {
    return (
      <Skeleton className="h-[20px] w-[100px] rounded-full" />
    )
  }

  console.log(isLoading, user)

  return (
    // sau khi fix
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-white">
      <ScrollToTop />
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
          <Route path="paypal-return" element={<PayPalReturnPage />} />
          <Route path="paypal-cancel" element={<PayPalCancelPage />} />
        </Route>

        <Route path="*" element={<NotFound />} /> {/* 404 route */}

        <Route path="/unauth-page" element={<UnauthPage />} /> {/* Unauthorized access route */}
      </Routes>

    </div>
  )
}

export default App

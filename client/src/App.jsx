import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AuthLayout from "./components/auth/layout"

import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    // sau khi fix
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-white">
      {/* <div className="flex flex-col overflow-hidden bg-white"></div> --> sai */}
      {/* common component */}
      <h1>Header component</h1>

      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* index route so /admin is not blank */}
          {/* <Route index element={<AdminDashboard />} /> */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
      </Routes>

    </div>
  )
}

export default App

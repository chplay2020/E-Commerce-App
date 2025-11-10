import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AuthLayout from "./components/auth/layout"
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
      </Routes>

    </div>
  )
}

export default App

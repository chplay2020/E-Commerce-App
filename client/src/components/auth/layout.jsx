import { Outlet } from "react-router-dom";

function AuthLayout() {
    console.log("AuthLayout is rendering!") // ← THÊM DÒNG NÀY

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%'
        }}>
            {/* Left Panel - 50% */}
            <div style={{
                width: '50%',
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 48px'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '2.25rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    Welcome to ECommerce Shopping
                </h1>
            </div>

            {/* Right Panel - 50% */}
            <div style={{
                width: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 16px'
            }}>
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout;
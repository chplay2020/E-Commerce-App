import { Navigate, useLocation } from "react-router-dom"



function CheckAuth({ isAuthenticated, user, children }) {

    const location = useLocation()

    console.log(location.pathname, isAuthenticated);

    // Allow PayPal return/cancel pages without authentication check
    if (location.pathname.includes('/paypal-return') ||
        location.pathname.includes('/paypal-cancel') ||
        location.pathname.includes('/payment-success')) {
        return <>{children}</>;
    }

    if (!isAuthenticated &&
        !(location.pathname.includes('/login') ||
            location.pathname.includes('/register'))) {
        return <Navigate to='/auth/login' />
    }

    if (isAuthenticated &&
        (location.pathname.includes('/login') ||
            location.pathname.includes('/register'))) {
        if (user?.role === 'admin') {
            return <Navigate to='/admin/dashboard' />
        } else {
            return <Navigate to='/shopping/home' />
        }
    }

    if (isAuthenticated &&
        user?.role !== 'admin' &&
        location.pathname.includes('/admin')) {
        return <Navigate to='/unauth-page' />
    }

    if (isAuthenticated &&
        user?.role === 'admin' &&
        location.pathname.includes('/shopping')) {
        return <Navigate to='/admin/dashboard' />
    }


    return (
        <>
            {children}
        </>
    )
}

export default CheckAuth
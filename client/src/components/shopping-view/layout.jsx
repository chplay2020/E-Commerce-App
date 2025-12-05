import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";



function ShoppingLayout() {
    return (
        <div className="flex flex-col bg-white overflow-x-hidden h-screen">
            {/* Common Header */}
            <ShoppingHeader />
            <main className="flex flex-col w-full max-w-full overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default ShoppingLayout;
import { Fragment } from "react";
import { ChartNoAxesCombined, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBasket, BadgeCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";


const adminSidebarMenuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icons: <LayoutDashboard />
    },
    {
        id: 'products',
        label: 'Products',
        path: '/admin/products',
        icons: <ShoppingBasket />
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icons: <BadgeCheck />
    },
    {
        id: 'users',
        label: 'Users',
        path: '/admin/users',
        icons: <Users />
    }
]


function MenuItems({ setOpen }) {

    const navigate = useNavigate();
    const location = useLocation();


    return (
        <nav className="mt-8 flex-col flex gap-2">
            {
                adminSidebarMenuItems.map((menuItem) => {
                    const isActive = location.pathname === menuItem.path;

                    return (
                        <div
                            key={menuItem.id}
                            onClick={() => {
                                navigate(menuItem.path);
                                if (setOpen) setOpen(false);
                            }}
                            className={`flex text-xl items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200
                                ${isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                {menuItem.icons}
                            </div>
                            <span className="text-sm font-medium">{menuItem.label}</span>
                        </div>
                    )
                })
            }
        </nav >
    )
}


function AdminSideBar({ open, setOpen }) {

    const navigate = useNavigate();

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64 p-6 lg:hidden">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b pb-4">
                            <SheetTitle
                                onClick={() => { navigate('/admin/dashboard'); if (setOpen) setOpen(false); }}
                                className="flex items-center gap-3 mb-4 cursor-pointer group">
                                <div className="p-2 bg-primary rounded-lg group-hover:shadow-lg transition-shadow duration-200">
                                    <ChartNoAxesCombined size={24} className="text-white" />
                                </div>
                                <h2 className="text-xl font-extrabold whitespace-nowrap bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </h2>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex shadow-sm">
                <div
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex cursor-pointer items-center gap-3 group mb-2"
                >
                    <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-lg group-hover:shadow-lg transition-all duration-200">
                        <ChartNoAxesCombined size={24} className="text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold whitespace-nowrap bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Admin Panel
                    </h2>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    )
}

export default AdminSideBar
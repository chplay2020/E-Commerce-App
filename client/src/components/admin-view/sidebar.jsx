import { Fragment } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    }
]


function MenuItems({ setOpen }) {

    const navigate = useNavigate();


    return (
        <nav className="mt-8 flex-col flex gap-2">
            {
                adminSidebarMenuItems.map((menuItem) =>
                    <div key={menuItem.id}
                        onClick={() => {
                            navigate(menuItem.path);
                            if (setOpen) setOpen(false);
                        }}
                        className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                    >
                        {menuItem.icons}
                        <span className="text-sm font-medium">{menuItem.label}</span>
                    </div>)
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
                        <SheetHeader className="border-b">
                            <SheetTitle
                                onClick={() => { navigate('/admin/dashboard'); if (setOpen) setOpen(false); }}
                                className="flex items-center gap-2 mb-5 mt-5 whitespace-nowrap text-2xl font-extrabold cursor-pointer">
                                <ChartNoAxesCombined size={30} />
                                <h2 className="text-2xl font-extrabold whitespace-nowrap">Admin Panel</h2>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div onClick={() => navigate('/admin/dashboard')}
                    className="flex cursor-pointer items-center gap-2">
                    <ChartNoAxesCombined size={30} />
                    <h2 className="text-2xl font-extrabold whitespace-nowrap">Admin Panel</h2>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    )
}

export default AdminSideBar
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { House, Menu, UserCog, LogOut, ShoppingBag } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { shoppingViewHeaderMenuItems } from "@/config"
import { ShoppingCart } from "lucide-react"
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Label } from "../ui/label"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { logoutUser } from "@/store/auth-slice/index"
import UserCartWrapper from "./cart-wrapper"
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice"
import { Badge } from "../ui/badge"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "../ui/dropdown-menu";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "../ui/avatar"



function MenuItems() {

    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    function handleNavigateMenuItem(getCurrentMenuItem) {
        sessionStorage.removeItem('filters');
        const currentFilter =
            getCurrentMenuItem.id !== 'home' &&
                getCurrentMenuItem.id !== 'products' &&
                getCurrentMenuItem.id !== 'search'
                ? (
                    {
                        category: [getCurrentMenuItem.id]
                    }
                ) : null;

        sessionStorage.setItem('filters', JSON.stringify(currentFilter));

        location.pathname.includes('listing') && currentFilter !== null ? (
            setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
        ) : navigate(getCurrentMenuItem.path);
    }

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {
                shoppingViewHeaderMenuItems.map((menuItem) => {
                    const isActive = location.pathname === menuItem.path ||
                        (menuItem.id !== 'home' && menuItem.id !== 'products' && menuItem.id !== 'search' &&
                            searchParams.get('category') === menuItem.id);

                    return (
                        <Label
                            key={menuItem.id}
                            onClick={() => handleNavigateMenuItem(menuItem)}
                            className={`text-sm font-medium cursor-pointer transition-all duration-200 relative group
                                ${isActive
                                    ? 'text-primary font-semibold'
                                    : 'text-gray-700 hover:text-primary'
                                }`}
                        >
                            {menuItem.label}
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200
                                ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                            />
                        </Label>
                    )
                })
            }
        </nav>
    )
}

function HeaderRightContent() {

    const { user } = useSelector((state) => state.auth)
    const { cartItems } = useSelector((state) => state.shopCart)
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser());
    }

    useEffect(() => {
        dispatch(fetchCartItems(user?.id));
    }, [dispatch, user?.id])

    // Tính tổng số sản phẩm trong giỏ hàng
    const totalCartItems = cartItems?.items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenCartSheet(true)}
                    className="relative hover:bg-primary/10 hover:border-primary transition-all duration-200 group"
                >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    {totalCartItems > 0 && (
                        <Badge
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 animate-pulse"
                        >
                            {totalCartItems > 99 ? '99+' : totalCartItems}
                        </Badge>
                    )}
                    <span className="sr-only">
                        User cart
                    </span>
                </Button>
                <UserCartWrapper
                    cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []}
                    setOpenCartSheet={setOpenCartSheet}
                />
            </Sheet>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-extrabold">
                            {user?.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel className="font-semibold">
                        Logged in as {user?.userName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => navigate('/shopping/account')}
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                        <UserCog className="mr-2 h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}


function ShoppingHeader() {

    const { isAuthenticated } = useSelector((state) => state.auth)


    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
                <Link
                    to='/shopping/home'
                    className="flex items-center gap-2 group transition-all duration-200 hover:scale-105"
                >
                    <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-lg group-hover:shadow-lg transition-all duration-200">
                        <House className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        E-Fashion
                    </span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="lg:hidden hover:bg-primary/10 hover:border-primary transition-all duration-200"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">
                                Toggle header menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs p-6">
                        <div className="flex flex-col gap-6">
                            <MenuItems />
                            <HeaderRightContent />
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems />
                </div>

                <div className="hidden lg:block">
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    )
}
export default ShoppingHeader
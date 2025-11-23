import { Link } from "react-router-dom"
import { House, Menu, UserCog, LogOut } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { shoppingViewHeaderMenuItems } from "@/config"
import { ShoppingCart } from "lucide-react"
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
import { DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { logoutUser } from "@/store/auth-slice/index"
import UserCartWrapper from "./cart-wrapper"
import { useState } from "react";


function MenuItems() {
    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {
                shoppingViewHeaderMenuItems.map((menuItem) => (
                    <Link key={menuItem.id} to={menuItem.path} className="text-sm font-medium">
                        {menuItem.label}
                    </Link>
                ))
            }
        </nav>
    )
}

function HeaderRightContent() {

    const { user } = useSelector((state) => state.auth)
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser());
    }

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button variant="outline" size="icon" onClick={() => setOpenCartSheet(true)}>
                    <ShoppingCart className="w-6 h-6" />
                    <span className="sr-only">
                        User cart
                    </span>
                </Button>
                <UserCartWrapper />
            </Sheet>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black">
                        <AvatarFallback className="bg-black text-white font-extrabold">
                            {user?.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>
                        Logged in as {user?.userName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/shopping/account')}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
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
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to='/shopping/home' className="flex items-center gap-2">
                    <House className="h-6 w-6" />
                    <span className="font-bold">
                        Ecommerce
                    </span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">
                                Toggle header menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs p-6">
                        <div className="flex flex-col gap-6">
                            <MenuItems />
                            {/* <HeaderRightContent /> */}
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
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";



function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate();

    // Tính tổng tiền giỏ hàng
    const totalPrice = cartItems && cartItems.length > 0
        ? cartItems.reduce((total, item) => {
            const price = item?.productId?.salePrice || item?.productId?.price || 0;
            const quantity = item?.quantity || 0;
            return total + (price * quantity);
        }, 0).toFixed(2)
        : "0.00";

    return (
        <SheetContent className="sm:max-w-md flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <SheetHeader className="border-b border-gray-200 pb-4 bg-white rounded-t-lg">
                <SheetTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-900">Shopping Cart</span>
                        {cartItems && cartItems.length > 0 && (
                            <span className="text-xs font-medium text-gray-500">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                </SheetTitle>
            </SheetHeader>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {cartItems && cartItems.length > 0 ? (
                    <div className="space-y-3">
                        {cartItems.map((item, index) => (
                            <div
                                key={item?.productId?._id}
                                className="animate-in slide-in-from-right duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <UserCartItemsContent cartItem={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-in fade-in duration-500">
                        <div className="p-6 bg-gray-100 rounded-full mb-4">
                            <ShoppingCart className="h-16 w-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Looks like you haven't added anything yet. Start shopping to fill it up!
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Total & Checkout (Fixed at bottom) */}
            {cartItems && cartItems.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-auto space-y-3 bg-white rounded-b-lg shadow-lg">


                    {/* Total Section */}
                    <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                                Total Amount:
                            </span>
                            <div className="text-right">
                                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                    ${totalPrice}
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">Including taxes</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            navigate('/shopping/checkout');
                            setOpenCartSheet(false);
                        }}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 group relative overflow-hidden">
                        {/* Hiệu ứng shine trên hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        <div className="flex items-center justify-center relative z-10">
                            <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                            Proceed to Checkout
                        </div>
                    </Button>
                </div>
            )}
        </SheetContent>
    )
}

export default UserCartWrapper;



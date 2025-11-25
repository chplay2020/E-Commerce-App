import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";




function UserCartItemsContent({ cartItem }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    function handleUpdateQuantity(getCartItem, typeOfAction) {
        const newQuantity = typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1;

        if (newQuantity < 1) {
            return;
        }

        if (newQuantity > getCartItem?.productId?.totalStock) {
            toast.error(`Only ${getCartItem?.productId?.totalStock} items available in stock`);
            return;
        }

        dispatch(updateCartQuantity({
            userId: user?.id,
            productId: getCartItem?.productId?._id,
            quantity: newQuantity
        })).then(data => {
            if (data?.payload?.success) {
                toast.success("Cart updated successfully");
            }
        });
    }

    function handleCartItemDelete(getCartItem) {
        dispatch(deleteCartItem({
            userId: user?.id,
            productId: getCartItem?.productId?._id
        })).then(data => {
            if (data?.payload?.success) {
                toast.success("Item removed from cart");
            }
        });
    }

    return (
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
            {/* Product Image */}
            <div className="relative group">
                <img
                    src={cartItem?.productId?.image}
                    alt={cartItem?.productId?.title}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100 group-hover:border-primary/30 transition-colors"
                />
                {cartItem?.productId?.salePrice > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        SALE
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                    {cartItem?.productId?.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        ${cartItem?.productId?.salePrice > 0
                            ? cartItem?.productId?.salePrice
                            : cartItem?.productId?.price}
                    </p>
                    {cartItem?.productId?.salePrice > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                            ${cartItem?.productId?.price}
                        </p>
                    )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(cartItem, "minus")}
                            className="h-7 w-7 rounded-l-md hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                            disabled={cartItem?.quantity === 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 min-w-[40px] text-center font-bold text-sm text-gray-800">
                            {cartItem?.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(cartItem, "plus")}
                            className="h-7 w-7 rounded-r-md hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                            disabled={cartItem?.quantity >= cartItem?.productId?.totalStock}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-gray-500 font-medium">
                        Subtotal:
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                        ${((cartItem?.productId?.salePrice || cartItem?.productId?.price) * cartItem?.quantity).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Delete Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCartItemDelete(cartItem)}
                className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-200 self-start"
                title="Remove item"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

        </div>
    )
}

export default UserCartItemsContent;


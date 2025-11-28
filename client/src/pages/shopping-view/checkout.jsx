import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from 'sonner';

function ShoppingCheckout() {
    const { cartItems } = useSelector((state) => state.shopCart);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { approvalUrl } = useSelector((state) => state.shopOrder);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const dispatch = useDispatch();

    const totalPrice = cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items.reduce((total, item) => {
            const price = item?.productId?.salePrice || item?.productId?.price || 0;
            const quantity = item?.quantity || 0;
            return total + (price * quantity);
        }, 0)
        : 0;


    function handleInitiatePaypalPayment() {
        if (!cartItems?.items || cartItems.items.length === 0) {
            toast.error("Your cart is empty. Please add items to proceed");
            return;
        }
        if (currentSelectedAddress === null) {
            toast.error("Please select one address to proceed.");
            return;
        }

        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId?._id,
                title: singleCartItem?.productId?.title,
                image: singleCartItem?.productId?.image,
                price:
                    singleCartItem?.productId?.salePrice > 0
                        ? singleCartItem?.productId?.salePrice
                        : singleCartItem?.productId?.price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "pending",
            totalAmount: totalPrice,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: "",
            payerId: "",
        };

        dispatch(createNewOrder(orderData)).then((data) => {
            console.log(data, "sangam");
            if (data?.payload?.success) {
                setIsPaymentStart(true);
            } else {
                setIsPaymentStart(false);
            }
        });
    }

    if (approvalUrl) {
        window.location.href = approvalUrl;
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} className="h-full w-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
                <div className="flex flex-col gap-4">
                    {cartItems && cartItems.items && cartItems.items.length > 0
                        ? cartItems.items.map((item) => (
                            <UserCartItemsContent key={item?.productId?._id} cartItem={item} />
                        ))
                        : null}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="mt-4 w-full">
                            <Button
                                onClick={handleInitiatePaypalPayment}
                                className="w-full"
                            >
                                {isPaymentStart ? "Processing Payment..." : "Checkout with Paypal"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
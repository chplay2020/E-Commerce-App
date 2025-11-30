import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


function PayPalReturnPage() {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('token'); // PayPal uses 'token' not 'paymentId'
    const payerId = params.get('PayerID');

    console.log('PayPal Return Params:', { paymentId, payerId });

    useEffect(() => {

        if (paymentId && payerId) {
            const getCurrentOrderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

            console.log('Capturing payment for order:', getCurrentOrderId);

            dispatch(
                capturePayment({
                    paymentId,
                    payerId,
                    orderId: getCurrentOrderId
                })
            ).then((data) => {
                console.log('Capture payment response:', data);
                if (data?.payload?.success) {
                    sessionStorage.removeItem('currentOrderId');
                    window.location.href = `/shopping/payment-success/${getCurrentOrderId}`;
                }
            })
        }

    }, [payerId, paymentId, dispatch]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Processing your PayPal payment...Please wait.
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PayPalReturnPage;
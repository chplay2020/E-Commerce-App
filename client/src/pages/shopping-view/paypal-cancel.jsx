import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PayPalCancelPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any payment session data
        sessionStorage.removeItem('currentOrderId');
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Your payment has been cancelled. No charges were made.
                    </p>
                    <div className="mt-6 space-y-3">
                        <Button
                            onClick={() => navigate('/shopping/checkout')}
                            className="w-full"
                        >
                            Return to Checkout
                        </Button>
                        <Button
                            onClick={() => navigate('/shopping/home')}
                            variant="outline"
                            className="w-full"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

export default PayPalCancelPage;

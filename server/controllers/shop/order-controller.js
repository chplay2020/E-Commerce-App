const { ordersController } = require('../../helpers/paypal');
const Order = require('../../models/Orders');

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cardId
        } = req.body;

        // Create PayPal order
        const collect = {
            body: {
                intent: 'CAPTURE',
                purchaseUnits: [{
                    amount: {
                        currencyCode: 'USD',
                        value: totalAmount.toFixed(2),
                        breakdown: {
                            itemTotal: {
                                currencyCode: 'USD',
                                value: totalAmount.toFixed(2)
                            }
                        }
                    },
                    items: cartItems.map(item => ({
                        name: item.title,
                        unitAmount: {
                            currencyCode: 'USD',
                            value: (item.salePrice || item.price).toFixed(2)
                        },
                        quantity: item.quantity.toString()
                    }))
                }],
                applicationContext: {
                    returnUrl: "http://localhost:5173/shopping/paypal-return",
                    cancelUrl: "http://localhost:5173/shopping/paypal-cancel"
                }
            },
            prefer: 'return=representation'
        };

        const { result: order } = await ordersController.createOrder(collect);

        const newlyCreatedOrder = new Order({
            userId,
            cardId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId: order.id,
            payerId: payerId || ''
        });

        await newlyCreatedOrder.save();

        const approvalUrl = order.links.find(link => link.rel === 'approve').href;

        res.status(201).json({
            success: true,
            orderId: newlyCreatedOrder._id,
            approvalUrl
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        res.status(500).json(
            {
                success: false,
                message: 'Error creating order',
                error: error.message
            }
        );
    }
}


const capturePayment = async (req, res) => {
    try {
        const { orderId, payerId, paymentId } = req.body;

        // Capture the PayPal order
        const collect = {
            id: paymentId,
            prefer: 'return=representation'
        };

        const { result: capture } = await ordersController.captureOrder(collect);

        // Update order in database
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.payerId = payerId;

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment captured successfully',
            data: order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error capturing payment',
        });
    }
}


module.exports = {
    createOrder,
    capturePayment
};
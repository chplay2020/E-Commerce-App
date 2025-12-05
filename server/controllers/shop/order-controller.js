const { ordersController } = require('../../helpers/paypal');
const Order = require('../../models/Orders');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const User = require('../../models/User');
const { sendOrderConfirmationEmail } = require('../../helpers/email');

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
            cartId
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
            cartId,
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
        order.paymentId = paymentId;
        order.payerId = payerId;

        const getCartId = order.cartId;

        for (const item of order.cartItems) {
            let product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${product.title} not enough stock`
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        // Lấy thông tin user để gửi email
        console.log('🔔 Attempting to send order confirmation email...');
        const user = await User.findById(order.userId);
        if (user) {
            const emailResult = await sendOrderConfirmationEmail(user.email, user.userName, order);
            if (emailResult.success) {
                console.log('✅ Order confirmation email sent successfully');
            } else {
                console.log('⚠️ Email failed but order completed:', emailResult.error);
            }
        } else {
            console.log('⚠️ User not found, cannot send email');
        }

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

const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId });

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found!',
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!',
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!',
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!',
        });
    }
};


module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
};
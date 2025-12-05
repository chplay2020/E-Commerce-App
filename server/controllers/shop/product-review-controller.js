const Order = require('../../models/Orders')
const Product = require('../../models/Product')
const ProductReview = require('../../models/Review')


const addProductReview = async (req, res) => {
    try {

        const { productId, userId, userName, reviewMessage, reviewValue } = req.body
        const order = await Order.findOne(
            {
                userId: userId,
                "cartItems.productId": productId,
                orderStatus: "confirmed"
            }
        )

        if (!order) {
            return res.status(403).json({
                success: false,
                message: 'You need to purchase the product before reviewing it.'
            })
        }

        const checkExistingReview = await ProductReview.findOne(
            {
                productId: productId,
                userId: userId
            }
        )

        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product!'
            })
        }

        const newReview = new ProductReview({
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue
        });

        await newReview.save();

        const reviews = await ProductReview.find({ productId: productId });
        const totalReviewsLength = reviews.length;
        const averageRating = reviews.reduce((acc, review) => acc + review.reviewValue, 0) / totalReviewsLength;

        await Product.findByIdAndUpdate(
            productId,
            {
                averageRating: averageRating,
                totalReviews: totalReviewsLength
            }
        );

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: newReview
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error'
            }
        );
    }
}

const getProductReview = async (req, res) => {
    try {

        const { productId } = req.params;

        const reviews = await ProductReview.find({ productId: productId });

        res.status(200).json({
            success: true,
            data: reviews
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error'
            }
        );
    }
}

module.exports = {
    addProductReview,
    getProductReview
}
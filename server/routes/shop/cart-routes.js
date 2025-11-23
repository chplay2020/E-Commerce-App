const express = require('express');

const {
    addToCart,
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem
} = require('../../controllers/shop/cart-controller');

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', addToCart);

// Lấy danh sách sản phẩm trong giỏ hàng theo userId
router.get('/get/:userId', fetchCartItems);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update-cart', updateCartItemQty);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:userId/:productId', deleteCartItem);

module.exports = router;

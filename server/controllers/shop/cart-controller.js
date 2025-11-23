const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

/**
 * THÊM SẢN PHẨM VÀO GIỎ HÀNG
 * - Kiểm tra thông tin đầu vào (userId, productId, quantity)
 * - Kiểm tra sản phẩm có tồn tại không
 * - Tìm giỏ hàng của user, nếu chưa có thì tạo mới
 * - Nếu sản phẩm đã có trong giỏ thì tăng số lượng, chưa có thì thêm mới
 * - Kiểm tra số lượng không vượt quá tồn kho
 */
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate dữ liệu đầu vào
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided'
            });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Tìm giỏ hàng của user
        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            // Nếu chưa có giỏ hàng, tạo mới
            cart = new Cart({
                userId: userId,
                items: []
            });
        }

        // Tìm xem sản phẩm đã có trong giỏ chưa
        const findCurrentProductIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            // Sản phẩm chưa có trong giỏ -> thêm mới
            cart.items.push({ productId: productId, quantity: quantity });
        } else {
            // Sản phẩm đã có -> cộng thêm số lượng
            cart.items[findCurrentProductIndex].quantity += quantity;
        }

        // Kiểm tra số lượng không vượt quá tồn kho
        const currentProductQty = findCurrentProductIndex === -1
            ? quantity
            : cart.items[findCurrentProductIndex].quantity;

        if (currentProductQty > product.totalStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.totalStock} items available in stock`,
                availableStock: product.totalStock
            });
        }

        // Lưu giỏ hàng
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cart
        });

    } catch (error) {
        console.log('Error adding item to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        })
    }
}

/**
 * LẤY DANH SÁCH SẢN PHẨM TRONG GIỎ HÀNG
 * - Tìm giỏ hàng theo userId
 * - Populate thông tin chi tiết của sản phẩm
 * - Tính tổng tiền giỏ hàng
 */
const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Tìm giỏ hàng và populate thông tin sản phẩm
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price salePrice totalStock'
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
                data: {
                    items: []
                }
            });
        }

        // Lọc bỏ các sản phẩm đã bị xóa (productId = null)
        const validItems = cart.items.filter(item => item.productId);

        if (validItems.length < cart.items.length) {
            // Cập nhật lại giỏ hàng nếu có sản phẩm bị xóa
            cart.items = validItems;
            await cart.save();
        }

        // Populate lại để đảm bảo có đầy đủ thông tin
        const populatedCartItems = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'image title price salePrice totalStock'
        });

        res.status(200).json({
            success: true,
            data: {
                ...populatedCartItems._doc,
                items: populatedCartItems.items.filter(item => item.productId)
            }
        });

    } catch (error) {
        console.log('Error fetching cart items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart items',
            error: error.message
        })
    }
}

/**
 * CẬP NHẬT SỐ LƯỢNG SẢN PHẨM TRONG GIỎ HÀNG
 * - Tìm giỏ hàng và sản phẩm cần cập nhật
 * - Kiểm tra số lượng mới có hợp lệ không
 * - Kiểm tra không vượt quá tồn kho
 * - Cập nhật số lượng mới
 */
const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided'
            });
        }

        // Kiểm tra sản phẩm tồn tại và lấy thông tin tồn kho
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Kiểm tra số lượng không vượt quá tồn kho
        if (quantity > product.totalStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.totalStock} items available in stock`,
                availableStock: product.totalStock
            });
        }

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Tìm sản phẩm trong giỏ hàng
        const findCurrentProductIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // Cập nhật số lượng mới
        cart.items[findCurrentProductIndex].quantity = quantity;
        await cart.save();

        // Populate thông tin sản phẩm để trả về
        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice totalStock'
        });

        res.status(200).json({
            success: true,
            message: 'Cart item updated successfully',
            data: cart
        });

    } catch (error) {
        console.log('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart item',
            error: error.message
        })
    }
}

/**
 * XÓA SẢN PHẨM KHỎI GIỎ HÀNG
 * - Tìm giỏ hàng của user
 * - Tìm và xóa sản phẩm khỏi danh sách items
 * - Lưu lại giỏ hàng
 */
const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: 'User ID and Product ID are required'
            });
        }

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Lọc bỏ sản phẩm cần xóa
        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        // Populate thông tin sản phẩm còn lại
        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice totalStock'
        });

        res.status(200).json({
            success: true,
            message: 'Cart item deleted successfully',
            data: cart
        });

    } catch (error) {
        console.log('Error deleting cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete cart item',
            error: error.message
        })
    }
}

module.exports = {
    addToCart,
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem
}
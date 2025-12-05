const Order = require('../../models/Orders');
const Product = require('../../models/Product');
const User = require('../../models/User');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        console.log('Fetching dashboard stats...');

        // Get total sales
        const orders = await Order.find({ paymentStatus: 'paid' });
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Get total orders
        const totalOrders = await Order.countDocuments();

        // Get total products
        const totalProducts = await Product.countDocuments();

        // Get total users
        const totalUsers = await User.countDocuments();

        console.log('Stats:', { totalSales, totalOrders, totalProducts, totalUsers });

        // Get sales by quarter (current year)
        const currentYear = new Date().getFullYear();

        const salesByQuarter = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    orderDate: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        quarter: {
                            $switch: {
                                branches: [
                                    { case: { $lte: [{ $month: '$orderDate' }, 3] }, then: 1 },
                                    { case: { $lte: [{ $month: '$orderDate' }, 6] }, then: 2 },
                                    { case: { $lte: [{ $month: '$orderDate' }, 9] }, then: 3 },
                                    { case: { $lte: [{ $month: '$orderDate' }, 12] }, then: 4 }
                                ]
                            }
                        }
                    },
                    total: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id.quarter': 1 }
            }
        ]);

        // Tạo dữ liệu đầy đủ cho 4 quý
        const quarterData = [
            { quarter: 'Q1', amount: 0 },
            { quarter: 'Q2', amount: 0 },
            { quarter: 'Q3', amount: 0 },
            { quarter: 'Q4', amount: 0 }
        ];

        salesByQuarter.forEach(item => {
            const index = item._id.quarter - 1;
            quarterData[index].amount = item.total;
        });

        // Get products statistics by category
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Tạo dữ liệu cho tất cả categories (có sẵn trong config)
        const categoryStats = [
            { name: 'Men', value: 0 },
            { name: 'Women', value: 0 },
            { name: 'Kids', value: 0 },
            { name: 'Accessories', value: 0 },
            { name: 'Footware', value: 0 }
        ];

        // Cập nhật số liệu thực từ database
        productsByCategory.forEach(item => {
            const categoryName = item._id.charAt(0).toUpperCase() + item._id.slice(1);
            const found = categoryStats.find(cat => cat.name.toLowerCase() === item._id.toLowerCase());
            if (found) {
                found.value = item.count;
            }
        });

        // Nếu không có sản phẩm nào, tạo dữ liệu mẫu
        const hasProducts = productsByCategory.length > 0;
        const productStats = hasProducts ? categoryStats : [
            { name: 'Men', value: 15 },
            { name: 'Women', value: 25 },
            { name: 'Kids', value: 12 },
            { name: 'Accessories', value: 18 },
            { name: 'Footware', value: 20 }
        ];

        // Get recent orders (last 5)
        const recentOrders = await Order.find()
            .sort({ orderDate: -1 })
            .limit(5);

        // Get user emails for recent orders
        const ordersWithEmails = await Promise.all(
            recentOrders.map(async (order) => {
                const user = await User.findById(order.userId).select('email');
                return {
                    id: order._id,
                    email: user?.email || 'N/A',
                    amount: order.totalAmount,
                    status: order.paymentStatus,
                    date: order.orderDate
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                totalSales: totalSales.toFixed(2),
                totalOrders,
                totalProducts,
                totalUsers,
                salesStatistics: {
                    quarters: quarterData,
                    year: currentYear
                },
                productsStatistics: productStats,
                recentOrders: ordersWithEmails
            }
        });
        console.log('Dashboard stats sent successfully');
    } catch (e) {
        console.error('Error fetching dashboard stats:', e);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: e.message
        });
    }
};

module.exports = {
    getDashboardStats
};


const Product = require('../../models/Product');

const getFilteredProducts = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

        let filters = {}

        if (category.length) {
            filters.category = { $in: category.split(',') };
        }

        if (brand.length) {
            filters.brand = { $in: brand.split(',') };
        }

        // Fetch products first
        let products = await Product.find(filters);

        // Sort products based on actual price (salePrice if available, otherwise price)
        products.sort((a, b) => {
            const priceA = (a.salePrice && a.salePrice > 0) ? a.salePrice : a.price;
            const priceB = (b.salePrice && b.salePrice > 0) ? b.salePrice : b.price;

            switch (sortBy) {
                case "price-lowtohigh":
                    return priceA - priceB;

                case "price-hightolow":
                    return priceB - priceA;

                case "title-atoz":
                    return a.title.localeCompare(b.title);

                case "title-ztoa":
                    return b.title.localeCompare(a.title);

                default:
                    return priceA - priceB;
            }
        });

        res.status(200).json({
            success: true,
            products: products
        });

    } catch (error) {
        console.log('Error fetching filtered products:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getFilteredProducts,
};
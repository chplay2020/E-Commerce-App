const Product = require('../../models/Product');


const searchProducts = async (req, res) => {
    try {

        const { keyword } = req.params;
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Keyword is required and must be a string'
            })
        }

        const regEx = new RegExp(keyword, 'i');
        const createSearchQuery = await Product.find({
            $or: [
                { title: { $regex: regEx } },
                { description: { $regex: regEx } },
                { category: { $regex: regEx } },
                { brand: { $regex: regEx } }
            ]
        });

        res.status(200).json({
            success: true,
            data: createSearchQuery
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
    searchProducts
};
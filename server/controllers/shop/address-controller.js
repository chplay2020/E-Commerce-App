const Address = require('../../models/Address');



const addAddress = async (req, res) => {
    try {

        const { userId, address, city, pincode, phone, notes } = req.body;

        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Invalid data provided',
                }
            );
        }

        const newlyCreatedAddress = new Address({
            userId,
            address,
            city,
            pincode,
            phone,
            notes
        });

        await newlyCreatedAddress.save();
        res.status(201).json(
            {
                success: true,
                message: 'Address added successfully',
                data: newlyCreatedAddress
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error',
            }
        );
    }
}


const fetchAllAddresses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'User ID is required',
                }
            );
        }

        const addressList = await Address.find({ userId });

        res.status(200).json(
            {
                success: true,
                data: addressList
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error',
            }
        );
    }
}



const editAddress = async (req, res) => {
    try {
        const { userId, addressID } = req.params;
        const formData = req.body;

        if (!userId || !addressID) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'User ID and Address ID are required',
                }
            );
        }

        const address = await Address.findOneAndUpdate(
            {
                _id: addressID,
                userId
            },
            formData,
            { new: true }
        );

        if (!address) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Address not found',
                }
            );
        }

        res.status(200).json(
            {
                success: true,
                message: 'Address updated successfully',
                data: address
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error',
            }
        );
    }
}



const deleteAddress = async (req, res) => {
    try {
        const { userId, addressID } = req.params;

        if (!userId || !addressID) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'User ID and Address ID are required',
                }
            );
        }

        const address = await Address.findOneAndDelete(
            {
                _id: addressID,
                userId
            }
        );

        if (!address) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Address not found',
                }
            );
        }

        res.status(200).json(
            {
                success: true,
                message: 'Address deleted successfully'
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: 'Error',
            }
        );
    }
}

module.exports = {
    addAddress,
    fetchAllAddresses,
    editAddress,
    deleteAddress
}
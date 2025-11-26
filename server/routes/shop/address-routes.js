const express = require('express');

const { addAddress, fetchAllAddresses, editAddress, deleteAddress } = require('../../controllers/shop/address-controller');

const router = express.Router();

router.post('/add', addAddress);
router.get('/get/:userId', fetchAllAddresses);
router.put('/update/:userId/:addressID', editAddress);
router.delete('/delete/:userId/:addressID', deleteAddress);

module.exports = router;
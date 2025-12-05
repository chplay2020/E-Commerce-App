require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth/auth-routes.js')
const adminProductsRouter = require('./routes/admin/products-routes.js')
const adminOrdersRouter = require('./routes/admin/orders-routes.js')
const adminDashboardRouter = require('./routes/admin/dashboard-routes.js')
const adminUsersRouter = require('./routes/admin/users-routes.js')

const shopProductsRouter = require('./routes/shop/product-routes.js')
const shopCartRouter = require('./routes/shop/cart-routes.js')
const shopAddressRouter = require('./routes/shop/address-routes.js')
const shopOrderRouter = require('./routes/shop/order-routes.js')
const shopSearchRouter = require('./routes/shop/search-routes.js')
const shopReviewRouter = require('./routes/shop/review-routes.js')

// create a database connection
// can create a separate file for this and import/use that file here

mongoose.connect(
    process.env.MONGODB_URI
).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
        ],
        credentials: true,
    })
)

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductsRouter)
app.use('/api/admin/orders', adminOrdersRouter)
app.use('/api/admin/dashboard', adminDashboardRouter)
app.use('/api/admin/users', adminUsersRouter)

app.use('/api/shop/products', shopProductsRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use('/api/shop/review', shopReviewRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
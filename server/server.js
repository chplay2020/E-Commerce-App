const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth/auth-routes.js')
const adminProductsRouter = require('./routes/admin/products-routes.js')
const shopProductsRouter = require('./routes/shop/product-routes.js')


// create a database connection
// can create a separate file for this and import/use that file here

mongoose.connect(
    'mongodb+srv://ratosan19_db_user:ihTgE0uTQr0dz24b@cluster0.cbmvvse.mongodb.net/'
).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(
    cors({
        origin: 'http://localhost:5173',
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
app.use('/api/shop/products', shopProductsRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
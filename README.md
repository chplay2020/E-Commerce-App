# 🛒 E-Commerce Web Application

A full-stack e-commerce platform built with **React**, **Node.js**, **Express**, **MongoDB**, and **PayPal** integration. This application provides a complete shopping experience with admin panel, user authentication, product management, reviews, search functionality, and email notifications.

---

## ✨ Features

### 🛍️ **Customer Features**
- ✅ User authentication (Register/Login/Logout)
- ✅ Browse products with filters (Category, Brand, Price)
- ✅ Product search functionality
- ✅ Product details with image gallery
- ✅ Star rating and review system
- ✅ Shopping cart management
- ✅ Multiple address management
- ✅ PayPal payment integration
- ✅ Order history and tracking
- ✅ Email notifications (Registration & Order confirmation)
- ✅ Responsive design for mobile and desktop

### 👨‍💼 **Admin Features**
- ✅ Admin dashboard with statistics
- ✅ User management (View all users)
- ✅ Product management (CRUD operations)
- ✅ Order management (View, Update status)
- ✅ Image upload to Cloudinary
- ✅ Sales analytics and metrics

### 🎯 **Key Highlights**
- 🔐 JWT-based authentication with HTTP-only cookies
- 💳 Secure PayPal payment integration
- 📧 Automated email notifications (Gmail SMTP)
- 📱 Modern UI with Tailwind CSS and shadcn/ui
- 🔍 Advanced search and filtering
- ⭐ Product review and rating system
- 📊 Admin dashboard with real-time statistics
- 🖼️ Image management with Cloudinary

---

## 🛠️ Tech Stack

### **Frontend**
- React 19
- Redux Toolkit (State Management)
- React Router DOM
- Tailwind CSS
- shadcn/ui Components
- Radix UI
- Axios
- Vite

### **Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer (Email)
- Multer (File Upload)
- Cloudinary (Image Storage)
- PayPal SDK

---

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (Local or MongoDB Atlas account)
- **PayPal Developer Account** (for payment integration)
- **Cloudinary Account** (for image storage)
- **Gmail Account** (for email notifications with App Password)

---

## 🚀 Installation & Setup

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/chplay2020/E-Commerce-App.git
cd E-Commerce-App
```

### 2️⃣ **Install Server Dependencies**

```bash
cd server
npm install
```

**Server Dependencies:**
```
bcryptjs, cloudinary, cookie-parser, cors, dotenv, express, 
jsonwebtoken, mongoose, multer, nodemon, nodemailer, 
@paypal/paypal-server-sdk
```

### 3️⃣ **Install Client Dependencies**

```bash
cd ../client
npm install
```

**Client Dependencies:**
```
react, react-dom, react-router-dom, @reduxjs/toolkit, axios,
tailwindcss, shadcn/ui, radix-ui components, lucide-react
```

### 4️⃣ **Configure Environment Variables**

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### 5️⃣ **Setup Email (Gmail App Password)**

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Create **App Password** for Mail
4. Copy the 16-character password
5. Use it in `EMAIL_PASSWORD` in `.env`

📖 **Detailed guide:** See `SETUP_EMAIL_GUIDE.md`

---

## ▶️ Running the Application

### **Development Mode**

#### Start Server (Port 5000)
```bash
cd server
npm run dev
```

#### Start Client (Port 5173)
```bash
cd client
npm run dev
```

### **Production Mode**

#### Build Client
```bash
cd client
npm run build
```

#### Start Server
```bash
cd server
npm start
```

---

## 📁 Project Structure

```
E-Commerce-App/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── assets/            # Images and static files
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin-view/   # Admin panel components
│   │   │   ├── shopping-view/ # Shopping components
│   │   │   ├── common/       # Shared components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── config/           # Configuration files
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux slices
│   │   └── App.jsx           # Main app component
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── controllers/          # Route controllers
│   │   ├── admin/           # Admin controllers
│   │   ├── auth/            # Authentication
│   │   └── shop/            # Shopping controllers
│   ├── helpers/             # Utility functions
│   │   ├── cloudinary.js   # Image upload
│   │   ├── paypal.js       # PayPal integration
│   │   └── email.js        # Email service
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   └── server.js           # Entry point
│
├── SETUP_EMAIL_GUIDE.md      # Email setup guide
└── README.md                 # This file
```

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Check authentication

### **Products (Shop)**
- `GET /api/shop/products` - Get filtered products
- `GET /api/shop/products/:id` - Get product details

### **Cart**
- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/:userId` - Get user cart
- `PUT /api/shop/cart/update` - Update cart item
- `DELETE /api/shop/cart/:userId/:productId` - Remove from cart

### **Orders**
- `POST /api/shop/order/create` - Create order
- `POST /api/shop/order/capture` - Capture payment
- `GET /api/shop/order/:userId` - Get user orders
- `GET /api/shop/order/details/:id` - Get order details

### **Reviews**
- `POST /api/shop/review/add` - Add product review
- `GET /api/shop/review/:productId` - Get product reviews

### **Search**
- `GET /api/shop/search/:keyword` - Search products

### **Admin - Products**
- `POST /api/admin/products/add` - Add product
- `PUT /api/admin/products/edit/:id` - Edit product
- `DELETE /api/admin/products/delete/:id` - Delete product
- `GET /api/admin/products` - Get all products

### **Admin - Orders**
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/update/:id` - Update order status

### **Admin - Dashboard**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### **Admin - Users**
- `GET /api/admin/users` - Get all users

---

## 👤 Default Admin Account

After setting up, you can create an admin account by:
1. Register a new user
2. Manually update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 📧 Email Notifications

The application sends automated emails for:

1. **Registration Confirmation** - Welcome email with account details
2. **Order Confirmation** - Order summary with products and delivery info

Email templates are HTML-formatted with beautiful styling.

---

## 💳 PayPal Integration

- Sandbox mode for testing
- Live mode ready for production
- Automatic inventory update after payment
- Order status tracking

---

## 🎨 UI Components

Built with:
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure PayPal integration

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Original Author:** Sangam Mukherjee  
**Modified By:** chplay2020

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support and questions, please open an issue in the repository.

---

## 🎉 Acknowledgments

- PayPal Developer for payment integration
- Cloudinary for image management
- MongoDB Atlas for database hosting
- shadcn/ui for amazing components

---

**Happy Shopping! 🛍️**
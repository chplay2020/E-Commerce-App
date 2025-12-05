const nodemailer = require('nodemailer');

// Cấu hình transporter cho email
const createTransporter = () => {
    // Kiểm tra cấu hình email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('❌ Email configuration missing! Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
        throw new Error('Email configuration not found');
    }

    if (process.env.EMAIL_USER === 'your_email@gmail.com' || process.env.EMAIL_PASSWORD === 'your_app_password') {
        console.error('❌ Please update EMAIL_USER and EMAIL_PASSWORD in .env file with your actual credentials');
        throw new Error('Email credentials not configured');
    }

    console.log('📧 Creating email transporter with:', process.env.EMAIL_USER);

    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Template email xác nhận đăng ký
const getRegistrationEmailTemplate = (userName, email) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Chào mừng đến với E-Commerce!</h1>
            </div>
            <div class="content">
                <h2>Xin chào ${userName}!</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại E-Commerce. Chúng tôi rất vui mừng chào đón bạn!</p>
                
                <p><strong>Thông tin tài khoản:</strong></p>
                <ul>
                    <li>Tên người dùng: ${userName}</li>
                    <li>Email: ${email}</li>
                </ul>
                
                <p>Bạn có thể bắt đầu mua sắm ngay bây giờ và khám phá hàng ngàn sản phẩm chất lượng.</p>
                
                <div style="text-align: center;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Bắt đầu mua sắm</a>
                </div>
                
                <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
                
                <p>Trân trọng,<br>Đội ngũ E-Commerce</p>
            </div>
            <div class="footer">
                <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                <p>&copy; 2024 E-Commerce. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;
};

// Template email xác nhận đơn hàng
const getOrderConfirmationEmailTemplate = (order, userName) => {
    const itemsList = order.cartItems.map(item => {
        const price = parseFloat(item.salePrice || item.price);
        const quantity = parseInt(item.quantity);
        const total = price * quantity;

        return `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${price.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${total.toFixed(2)}</td>
        </tr>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                }
                .order-info {
                    background: white;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                    border-left: 4px solid #667eea;
                }
                .items-table {
                    width: 100%;
                    margin: 20px 0;
                    background: white;
                    border-collapse: collapse;
                }
                .items-table th {
                    background: #667eea;
                    color: white;
                    padding: 12px;
                    text-align: left;
                }
                .total {
                    background: #667eea;
                    color: white;
                    padding: 15px;
                    text-align: right;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 10px;
                    border-radius: 5px;
                }
                .address-box {
                    background: white;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                    padding: 20px;
                    border-radius: 0 0 10px 10px;
                    background: #f9f9f9;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✅ Đơn hàng đã được xác nhận!</h1>
            </div>
            <div class="content">
                <h2>Xin chào ${userName}!</h2>
                <p>Cảm ơn bạn đã đặt hàng tại E-Commerce. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
                
                <div class="order-info">
                    <h3>Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> #${order._id}</p>
                    <p><strong>Ngày đặt hàng:</strong> ${new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái:</strong> ${order.orderStatus === 'confirmed' ? 'Đã xác nhận' : order.orderStatus}</p>
                    <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'paypal' ? 'PayPal' : order.paymentMethod}</p>
                    <p><strong>Trạng thái thanh toán:</strong> ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : order.paymentStatus}</p>
                </div>

                <h3>Chi tiết sản phẩm</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th style="text-align: center;">Số lượng</th>
                            <th style="text-align: right;">Đơn giá</th>
                            <th style="text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                </table>

                <div class="total">
                    Tổng cộng: $${order.totalAmount.toFixed(2)}
                </div>

                <h3>Địa chỉ giao hàng</h3>
                <div class="address-box">
                    <p><strong>${order.addressInfo.address}</strong></p>
                    <p>${order.addressInfo.city}, ${order.addressInfo.pincode}</p>
                    <p>Điện thoại: ${order.addressInfo.phone}</p>
                    ${order.addressInfo.notes ? `<p>Ghi chú: ${order.addressInfo.notes}</p>` : ''}
                </div>

                <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.</p>
                
                <p>Trân trọng,<br>Đội ngũ E-Commerce</p>
            </div>
            <div class="footer">
                <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                <p>&copy; 2024 E-Commerce. All rights reserved.</p>
            </div>
        </body>
        </html>
    `;
};

// Hàm gửi email đăng ký
const sendRegistrationEmail = async (userEmail, userName) => {
    try {
        console.log(`📤 Preparing to send registration email to: ${userEmail}`);

        const transporter = createTransporter();

        const mailOptions = {
            from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🎉 Chào mừng bạn đến với E-Commerce!',
            html: getRegistrationEmailTemplate(userName, userEmail)
        };

        console.log('📧 Sending registration email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Registration email sent successfully! MessageID:', info.messageId);
        console.log('   To:', userEmail);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending registration email:', error.message);
        console.error('   Full error:', error);
        return { success: false, error: error.message };
    }
};

// Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
    try {
        console.log(`📤 Preparing to send order confirmation email to: ${userEmail}`);
        console.log(`   Order ID: ${order._id}`);

        const transporter = createTransporter();

        const mailOptions = {
            from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `✅ Xác nhận đơn hàng #${order._id}`,
            html: getOrderConfirmationEmailTemplate(order, userName)
        };

        console.log('📧 Sending order confirmation email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent successfully! MessageID:', info.messageId);
        console.log('   To:', userEmail);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error.message);
        console.error('   Full error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendRegistrationEmail,
    sendOrderConfirmationEmail
};

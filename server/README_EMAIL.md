# Hướng dẫn cấu hình Email cho E-Commerce App

## Đã thêm các chức năng:
✅ Email xác nhận đăng ký tài khoản
✅ Email xác nhận đơn hàng khi thanh toán thành công

## Cấu hình Email SMTP

### Bước 1: Cấu hình Gmail App Password

Để sử dụng Gmail gửi email, bạn cần tạo App Password:

1. Truy cập: https://myaccount.google.com/security
2. Bật "2-Step Verification" (Xác minh 2 bước)
3. Tìm "App passwords" (Mật khẩu ứng dụng)
4. Chọn "Mail" và "Windows Computer"
5. Click "Generate" để tạo mật khẩu
6. Copy mật khẩu 16 ký tự (dạng: xxxx xxxx xxxx xxxx)

### Bước 2: Cập nhật file .env

Mở file `server/.env` và cập nhật các biến sau:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

**Lưu ý:** 
- `EMAIL_USER`: Địa chỉ Gmail của bạn
- `EMAIL_PASSWORD`: App Password vừa tạo (16 ký tự, không có khoảng trắng)

### Bước 3: Khởi động lại server

```bash
cd server
npm run dev
```

## Các template email đã tạo:

### 1. Email đăng ký tài khoản
- Gửi tự động khi user đăng ký thành công
- Bao gồm: Thông tin tài khoản, nút "Bắt đầu mua sắm"
- Template HTML đẹp với gradient màu tím

### 2. Email xác nhận đơn hàng
- Gửi tự động khi thanh toán thành công
- Bao gồm:
  - Mã đơn hàng
  - Danh sách sản phẩm
  - Tổng tiền
  - Địa chỉ giao hàng
  - Trạng thái đơn hàng

## Các file đã tạo/cập nhật:

1. **`server/helpers/email.js`** (MỚI)
   - Cấu hình nodemailer
   - Template HTML cho email
   - Hàm `sendRegistrationEmail()`
   - Hàm `sendOrderConfirmationEmail()`

2. **`server/controllers/auth/auth-controller.js`** (CẬP NHẬT)
   - Thêm gửi email sau khi đăng ký thành công

3. **`server/controllers/shop/order-controller.js`** (CẬP NHẬT)
   - Thêm gửi email sau khi thanh toán thành công

4. **`server/.env`** (CẬP NHẬT)
   - Thêm biến môi trường cho email

## Test chức năng:

### Test email đăng ký:
1. Đăng ký tài khoản mới
2. Kiểm tra hộp thư đến của email đã đăng ký
3. Bạn sẽ nhận được email chào mừng

### Test email đơn hàng:
1. Đặt hàng và thanh toán qua PayPal
2. Sau khi thanh toán thành công
3. Kiểm tra email sẽ nhận được xác nhận đơn hàng

## Sử dụng email service khác (ngoài Gmail):

Nếu muốn dùng email service khác, cập nhật trong `.env`:

### Outlook/Hotmail:
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

### Custom SMTP:
Sửa file `server/helpers/email.js`:
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.your-email-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## Xử lý lỗi:

Nếu email không gửi được, kiểm tra:
1. ✅ App Password đã đúng chưa
2. ✅ Gmail đã bật 2-Step Verification chưa
3. ✅ Biến môi trường trong .env đã đúng chưa
4. ✅ Xem console log có lỗi gì không

## Ghi chú:

- Email được gửi bất đồng bộ (async) để không ảnh hưởng đến response time
- Nếu gửi email thất bại, ứng dụng vẫn hoạt động bình thường
- Log sẽ hiển thị trong console khi email được gửi thành công/thất bại

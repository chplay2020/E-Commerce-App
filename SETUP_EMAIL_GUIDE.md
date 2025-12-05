# 📧 Hướng Dẫn Cấu Hình Email Chi Tiết

## Vấn đề: Email không được gửi?

Nếu email không gửi được, hãy làm theo các bước sau:

## ✅ BƯỚC 1: Tạo App Password cho Gmail

### Cách tạo App Password:

1. **Đăng nhập Gmail** mà bạn muốn dùng để gửi email

2. **Truy cập Google Account Security:**
   - Link: https://myaccount.google.com/security
   - Hoặc: Gmail → Click avatar → Manage your Google Account → Security

3. **Bật 2-Step Verification (Xác minh 2 bước):**
   - Tìm mục "2-Step Verification"
   - Click "Get started"
   - Làm theo hướng dẫn để bật

4. **Tạo App Password:**
   - Quay lại Security page
   - Tìm "App passwords" (hoặc "Mật khẩu ứng dụng")
   - Chọn app: **Mail**
   - Chọn device: **Windows Computer**
   - Click "Generate"
   - **QUAN TRỌNG:** Copy mật khẩu 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

### Video hướng dẫn:
- Search YouTube: "How to create Gmail App Password 2024"

---

## ✅ BƯỚC 2: Cập Nhật File .env

Mở file: `server/.env`

Tìm dòng:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Thay đổi thành (ví dụ):
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_real_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**LƯU Ý:**
- `EMAIL_USER`: Địa chỉ Gmail thật của bạn
- `EMAIL_PASSWORD`: App Password 16 ký tự (CÓ THỂ có hoặc không có khoảng trắng)
- KHÔNG dùng mật khẩu Gmail thông thường

---

## ✅ BƯỚC 3: Khởi Động Lại Server

Sau khi cập nhật `.env`, BẮT BUỘC phải khởi động lại server:

```bash
# Tắt server hiện tại (Ctrl + C)
# Sau đó chạy lại:
cd server
npm run dev
```

---

## ✅ BƯỚC 4: Test Email

### Test email đăng ký:
1. Mở app: http://localhost:5173
2. Đăng ký tài khoản mới
3. Kiểm tra terminal/console server - Bạn sẽ thấy log:
   ```
   📤 Preparing to send registration email to: user@example.com
   📧 Sending registration email...
   ✅ Registration email sent successfully!
   ```
4. Kiểm tra hộp thư email (cả Inbox và Spam)

### Test email đơn hàng:
1. Đặt hàng và thanh toán
2. Kiểm tra terminal/console
3. Kiểm tra email

---

## 🔍 KIỂM TRA LỖI

### Xem Log trong Console:

Khi server chạy, bạn sẽ thấy các log:

**Thành công:**
```
📧 Creating email transporter with: your_email@gmail.com
📤 Preparing to send registration email to: user@example.com
📧 Sending registration email...
✅ Registration email sent successfully! MessageID: <xxx@gmail.com>
```

**Lỗi cấu hình:**
```
❌ Email configuration missing! Please set EMAIL_USER and EMAIL_PASSWORD
```
→ **Giải pháp:** Cập nhật file `.env`

**Lỗi xác thực:**
```
❌ Error sending registration email: Invalid login: 535-5.7.8 Username and Password not accepted
```
→ **Giải pháp:** 
- Kiểm tra lại App Password
- Đảm bảo đã bật 2-Step Verification
- Tạo lại App Password mới

**Lỗi kết nối:**
```
❌ Error sending registration email: connect ETIMEDOUT
```
→ **Giải pháp:** 
- Kiểm tra kết nối internet
- Kiểm tra firewall/antivirus

---

## 🛠️ TROUBLESHOOTING

### Lỗi 1: "Invalid login"
**Nguyên nhân:** App Password sai hoặc chưa được tạo
**Giải pháp:**
1. Tạo lại App Password mới
2. Copy chính xác (bỏ khoảng trắng nếu cần)
3. Restart server

### Lỗi 2: "Missing credentials"
**Nguyên nhân:** `.env` chưa được cập nhật
**Giải pháp:**
1. Mở `server/.env`
2. Thay `your_email@gmail.com` bằng email thật
3. Thay `your_app_password` bằng App Password
4. Save file
5. Restart server

### Lỗi 3: Email vào Spam
**Giải pháp:**
1. Kiểm tra thư mục Spam/Junk
2. Đánh dấu "Not Spam"
3. Thêm địa chỉ gửi vào Contacts

### Lỗi 4: Không thấy log gì
**Giải pháp:**
1. Kiểm tra xem server có đang chạy không
2. Mở Console/Terminal của server
3. Thử đăng ký lại

---

## 📝 CHECKLIST

Trước khi báo lỗi, hãy kiểm tra:

- [ ] Đã bật 2-Step Verification cho Gmail
- [ ] Đã tạo App Password
- [ ] Đã cập nhật `EMAIL_USER` trong `.env`
- [ ] Đã cập nhật `EMAIL_PASSWORD` trong `.env`
- [ ] Đã restart server sau khi đổi `.env`
- [ ] Đã kiểm tra console log khi test
- [ ] Đã kiểm tra cả Inbox và Spam

---

## 💡 MẸO

1. **Dùng email khác Gmail:**
   ```env
   # Outlook/Hotmail
   EMAIL_SERVICE=hotmail
   EMAIL_USER=your_email@outlook.com
   EMAIL_PASSWORD=your_password
   ```

2. **Debug mode:** Xem toàn bộ log trong console server

3. **Test nhanh:** Tạo account test để thử nghiệm

---

## 🆘 VẪN GẶP VẤN ĐỀ?

1. Check console log server
2. Copy toàn bộ error message
3. Kiểm tra lại tất cả bước trên
4. Thử với email khác

**Email được gửi qua SMTP Gmail có giới hạn:**
- ~500 emails/ngày cho tài khoản miễn phí
- Đủ cho việc development và testing

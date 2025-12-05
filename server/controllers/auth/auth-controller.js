
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { sendRegistrationEmail } = require('../../helpers/email')


//register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body

    try {

        // Kiểm tra nếu email đã tồn tại
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please login instead.'
            })
        }

        // Mã hóa mật khẩu
        const hashPassword = await bcrypt.hash(password, 10)


        // Tạo người dùng mới với mật khẩu đã mã hóa
        const newUser = new User({
            userName,
            email,
            password: hashPassword
        })

        await newUser.save()

        // Gửi email xác nhận đăng ký
        console.log('🔔 Attempting to send registration email...');
        const emailResult = await sendRegistrationEmail(email, userName);
        if (emailResult.success) {
            console.log('✅ Email sent successfully');
        } else {
            console.log('⚠️ Email failed but registration completed:', emailResult.error);
        }

        // Gửi phản hồi thành công
        res.status(201).json({
            success: true,
            message: 'Registration successfully. Please check your email for confirmation.'
        })

    } catch (error) {
        console.error('Registration Error:', error)
        res.status(500).json({
            success: false,
            message: 'Registration error'
        })
    }
}



//login
const loginUser = async (req, res) => {
    const { email, password } = req.body


    try {

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found. Please register first.'
            })
        }

        const checkPasswordMatch = await bcrypt.compare(password, existingUser.password)
        if (!checkPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Tạo token JWT
        const token = jwt.sign(
            {
                id: existingUser._id,
                role: existingUser.role,
                email: existingUser.email,
                userName: existingUser.userName
            },
            'CLIENT_SECRET_KEY', { expiresIn: '1h' }
        )

        res.cookie('token', token,
            {
                httpOnly: true,
                secure: false, //process.env.NODE_ENV === 'production',
                // sameSite: 'strict',
                // maxAge: 3600000 // 1 hour
            }
        ).json({
            success: true,
            message: 'Login successfully',
            user: {
                email: existingUser.email,
                role: existingUser.role,
                id: existingUser._id,
                userName: existingUser.userName
            },
            token // Gửi token về phía client (frontend)
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}




//logout

const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'Logout successfully'
    })
}



//aut middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Authorization denied.'
        })
    }
    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY')
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Authorization denied.'
        })
    }
}






module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware
}
const User = require('../../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        // Trả về mảng rỗng nếu không có user thay vì 404
        res.status(200).json({
            success: true,
            data: users,
            message: users.length === 0 ? 'No users found' : `Found ${users.length} users`
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Không cho phép xóa admin
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin user',
            });
        }

        // Xóa user
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
        });
    }
};

module.exports = {
    getAllUsers,
    deleteUser
};

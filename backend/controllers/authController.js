import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        // Validate input
        if (!employeeId || !password) {
            return res.status(400).json({
                message: 'Employee ID and password are required'
            });
        }

        // Find user by employeeId 
        const user = await User.findOne({ employeeId });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send success response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                employeeId: user.employeeId,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
}; 
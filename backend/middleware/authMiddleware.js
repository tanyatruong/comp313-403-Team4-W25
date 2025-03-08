import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token and attach user to request
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in cookies or authorization header
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by id
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
};

// Middleware to check if user is an employee
export const employeeOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Employee') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only employees can create tickets.' });
    }
};

// Middleware to check if user is HR
export const hrOnly = (req, res, next) => {
    if (req.user && req.user.role === 'HR') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only HR personnel can access this resource.' });
    }
};

// Middleware to check if user is an admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only admins can access this resource.' });
    }
};

// Middleware to check if user is HR or admin
export const hrOrAdminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only HR or admin can access this resource.' });
    }
}; 
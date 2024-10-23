import jwt from 'jsonwebtoken';

// Middleware to protect routes
export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id; // Add user ID to request object
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};


import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { config } from "../config/env.js";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt_secret || "", { expiresIn: "5m" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.refresh_secret|| "", {
    expiresIn: "30d",
  });
};

// Refresh Token Controller
export const refreshTokenController = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required' });
    }
    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, config.refresh_secret);
        // Issue a new access token
        const newAccessToken = jwt.sign({ id: decoded.id }, config.jwt_secret, { expiresIn: '15m' });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


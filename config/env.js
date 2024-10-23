import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const config = {
    port: process.env.PORT,
    mongo_url:process.env.MONGO_URL,
    jwt_secret:process.env.JWT_SECRET,
    refresh_secret:process.env.REFRESH_SECRET
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './env.js';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo_url || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

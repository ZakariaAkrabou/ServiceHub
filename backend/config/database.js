import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const mongoURI = process.env.DB_CONNECTION_STRING;


const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
     
    });
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); 
  }
};

export default connectDB;
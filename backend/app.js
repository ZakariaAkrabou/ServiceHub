import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
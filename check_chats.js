import mongoose from 'mongoose';
import Chat from './backend/models/chat.model.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/servicehub')
  .then(async () => {
    const chats = await Chat.find({});
    console.log("Total chats:", chats.length);
    console.log(chats);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

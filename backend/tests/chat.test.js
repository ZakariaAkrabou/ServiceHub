import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import http from 'http';
import { io as Client } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import chatRoutes from '../routes/chat.route.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import Chat from '../models/chat.model.js';
import { initSocket } from '../config/socket.js';
import { chatSocket } from '../socket/chatSocket.js';

let mongoServer;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = initSocket(server);
chatSocket(io);

app.set('io', io);

let port;
let customerClientSocket, providerClientSocket;
let customerUser, providerUser, serviceItem, bookingItem;
let customerToken, providerToken;

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await new Promise((resolve) => {
    server.listen(() => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  io.close();
  server.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
  if (customerClientSocket) customerClientSocket.disconnect();
  if (providerClientSocket) providerClientSocket.disconnect();
});
//COM

describe('Chat Integration Tests', () => {
  beforeEach(async () => {
    providerUser = new User({
      firstName: 'Provider', lastName: 'User',
      email: 'provider@example.com', password: 'password',
      role: 'service_provider', isVerified: true,
      status: 'approved', phone: '1234567890', location: 'Location',
      serviceCategory: ['Cleaning'], serviceDescription: 'Description'
    });
    await providerUser.save();
    providerToken = generateToken(providerUser);

    customerUser = new User({
      firstName: 'Customer', lastName: 'User',
      email: 'customer@example.com', password: 'password',
      role: 'customer', isVerified: true
    });
    await customerUser.save();
    customerToken = generateToken(customerUser);

    serviceItem = new Service({
      name: 'Service', description: 'Desc', price: 100,
      category: 'Cleaning', provider_id: providerUser._id,
      availability: ['available']
    });
    await serviceItem.save();

    bookingItem = new Booking({
      customer_id: customerUser._id,
      service_id: serviceItem._id,
      booking_time: new Date(),
      status: 'confirmed',
      chosenContactMethod: 'chat'
    });
    await bookingItem.save();
  });

  it('should verify chat is available via API after booking is confirmed and contact method is chat', async () => {
    const response = await request(app)
      .get(`/api/chat/${bookingItem._id}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.chat).toEqual([]);
  });

  it('should fail to load chat if booking is not confirmed or method is not chat', async () => {
    bookingItem.status = 'pending';
    await bookingItem.save();

    const response = await request(app)
      .get(`/api/chat/${bookingItem._id}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Chat not available for this booking');
  });

  it('should deliver messages in real time via socket.io and store them in DB', (done) => {
    customerClientSocket = Client(`http://localhost:${port}`);
    providerClientSocket = Client(`http://localhost:${port}`);

    const bookingId = bookingItem._id.toString();

    providerClientSocket.on('connect', () => {
      providerClientSocket.emit('joinRoom', bookingId, providerUser._id.toString());
    });

    customerClientSocket.on('connect', () => {
      customerClientSocket.emit('joinRoom', bookingId, customerUser._id.toString());

      setTimeout(() => {
        customerClientSocket.emit('sendMessage', {
          data: {
            bookingId: bookingId,
            senderId: customerUser._id.toString(),
            message: 'Hello provider, I booked your service!'
          }
        });
      }, 100);
    });

    providerClientSocket.on('receive_message', async (data) => {
      try {
        expect(data.success).toBe(true);
        expect(data.message.message).toBe('Hello provider, I booked your service!');
        expect(data.message.sender_id).toBe(customerUser._id.toString());
        expect(data.message.receiver_id).toBe(providerUser._id.toString());

        const dbMessages = await Chat.find({ booking_id: bookingId });
        expect(dbMessages.length).toBe(1);
        expect(dbMessages[0].message).toBe('Hello provider, I booked your service!');
        
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});

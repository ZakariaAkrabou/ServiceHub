import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import serviceRoutes from '../routes/service.route.js';
import customerRoutes from '../routes/customer.route.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';
import Notification from '../models/notification.model.js';
import cookieParser from 'cookie-parser';

let mongoServer;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.set('io', { to: () => ({ emit: () => {} }) });

app.use('/api/services', serviceRoutes);
app.use('/api/customer', customerRoutes);

const originalEnv = process.env;

beforeAll(async () => {
  process.env = { 
    ...originalEnv, 
    JWT_SECRET: 'testsecret',
    JWT_REFRESH_SECRET: 'testrefreshsecret'
  };

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  process.env = originalEnv;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

describe('iT-02: Book a Service Integration Tests', () => {
  let customerUser, providerUser, serviceItem;
  let customerToken, providerToken;

  beforeEach(async () => {
    providerUser = new User({
      firstName: 'Provider',
      lastName: 'User',
      email: 'provider@example.com',
      password: 'password123',
      role: 'service_provider',
      isVerified: true,
      status: 'approved',
      phone: '1234567890',
      location: 'Test Location',
      serviceCategory: ['Cleaning'],
      serviceDescription: 'Test provider description'
    });
    await providerUser.save();
    providerToken = generateToken(providerUser);

    customerUser = new User({
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      isVerified: true
    });
    await customerUser.save();
    customerToken = generateToken(customerUser);

    serviceItem = new Service({
      name: 'Test Cleaning Service',
      category: 'Cleaning',
      price: 100,
      description: 'Professional house cleaning',
      provider_id: providerUser._id,
      availability: ['available']
    });
    await serviceItem.save();
  });

  it('should successfully book a service and create a notification', async () => {
    const bookingTime = new Date();
    bookingTime.setDate(bookingTime.getDate() + 1); // Tomorrow

    const response = await request(app)
      .post('/api/customer/create-bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        service_id: serviceItem._id,
        booking_time: bookingTime.toISOString()
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.service_id).toBe(serviceItem._id.toString());
    expect(response.body.data.customer_id).toBe(customerUser._id.toString());

    const bookingInDb = await Booking.findById(response.body.data._id);
    expect(bookingInDb).not.toBeNull();
    expect(bookingInDb.status).toBe('pending');

    const notification = await Notification.findOne({ user_id: providerUser._id, booking_id: bookingInDb._id });
    expect(notification).not.toBeNull();
    expect(notification.type).toBe('new_booking');
  });

  it('should not allow booking a service with a past date', async () => {
    const pastTime = new Date();
    pastTime.setDate(pastTime.getDate() - 1); // Yesterday

    const response = await request(app)
      .post('/api/customer/create-bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        service_id: serviceItem._id,
        booking_time: pastTime.toISOString()
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The date must be in the future.');
  });

  it('should not allow a provider to book their own service', async () => {
    const bookingTime = new Date();
    bookingTime.setDate(bookingTime.getDate() + 1); 

    const response = await request(app)
      .post('/api/customer/create-bookings')
      .set('Authorization', `Bearer ${providerToken}`) 
      .send({
        service_id: serviceItem._id,
        booking_time: bookingTime.toISOString()
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You cannot book your own service.');
  });

  it('should prevent double booking for the same slot', async () => {
    const bookingTime = new Date();
    bookingTime.setDate(bookingTime.getDate() + 1);

  
    await Booking.create({
      customer_id: customerUser._id,
      service_id: serviceItem._id,
      booking_time: bookingTime,
      status: 'pending'
    });

    const response = await request(app)
      .post('/api/customer/create-bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        service_id: serviceItem._id,
        booking_time: bookingTime.toISOString()
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('This slot is already booked.');
  });
});
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import authRoutes from '../routes/auth.route.js';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser';

let mongoServer;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);


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

describe('User Login Integration Test', () => {
  let testUser;

  beforeEach(async () => {
  
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'customer',
      isVerified: true,
    });
    await testUser.save();
  });

  it('should successfully log in a user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('john@example.com');
    expect(response.body.user.firstName).toBe('John');
    

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/refreshToken=/);
  });

  it('should reject login with invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should reject login for a non-existent user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should reject login if email is unverified', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const unverifiedUser = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'customer',
      isVerified: false,
    });
    await unverifiedUser.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Please verify your email before logging in');
  });

  it('should reject login if user is banned', async () => {
    testUser.isBanned = true;
    testUser.banInfo = { reason: 'Violation of terms' };
    await testUser.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Your account is banned');
    expect(response.body).toHaveProperty('reason', 'Violation of terms');
  });
});

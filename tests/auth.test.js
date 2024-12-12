import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../config/test.env') });

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);

  const module = await import('../index.js');
  app = module.default;
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoServer.stop();
});

describe('Auth Endpoints', () => {
  test('POST /api/v1/auth/register - should validate registration input', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Registration successful. Please wait for admin approval.');
  });

  test('POST /api/v1/auth/login - should validate login for unapproved user', async () => {
    // Create a mock unapproved user
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'unapprovedUser',
        email: 'unapproved@gmail.com',
        password: 'password123',
        role: 'user',
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'unapproved@gmail.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Your account is pending approval');
  });

  test('POST /api/v1/auth/login - should successfully login an approved user', async () => {
    // Create a mock approved user
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'approvedUser',
        email: 'approved@gmail.com',
        password: 'password123',
        role: 'user',
      });

    await mongoose.connection.collection('users').updateOne(
      { email: 'approved@gmail.com' },
      { $set: { isApproved: true } }
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'approved@gmail.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'approved@gmail.com');
    expect(res.body.user).toHaveProperty('username', 'approvedUser');
  });

  test('POST /api/v1/auth/login - should return error for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@gmail.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('POST /api/v1/auth/login - should return error for incorrect password', async () => {
    // Create a mock user
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testUser',
        email: 'testuser@gmail.com',
        password: 'correctpassword',
        role: 'user',
      });

    await mongoose.connection.collection('users').updateOne(
      { email: 'testuser@gmail.com' },
      { $set: { isApproved: true } }
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@gmail.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

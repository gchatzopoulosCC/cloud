const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the Express app
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testAuthBackend', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123',
      emailVerified: true,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a user', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'StrongPass123',
    });
    expect(res.status).toBe(201);
    expect(res.text).toContain('User registered successfully');
  });

  it('should not register a user with a weak password', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'weakuser',
      email: 'weakuser@example.com',
      password: 'weak',
    });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Password must be at least 8 characters long');
  });

  it('should login a user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'Password123',
    });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login successful');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'WrongPassword',
    });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Invalid email or password');
  });

  it('should send password reset email', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'testuser@example.com' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Password reset email sent');
  });

  it('should reset the password', async () => {
    const resetToken = 'test-reset-token';
    testUser.resetPasswordToken = resetToken;
    testUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await testUser.save();

    const res = await request(app)
      .post(`/auth/reset-password/${resetToken}`)
      .send({ password: 'NewPassword123' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Password reset successfully');

    // Verify that the new password works
    const loginRes = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'NewPassword123',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.text).toContain('Login successful');
  });

  it('should not reset password with invalid or expired token', async () => {
    const res = await request(app)
      .post('/auth/reset-password/invalid-token')
      .send({ password: 'NewPassword123' });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Invalid or expired password reset token');
  });
});

import request from 'supertest';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });
process.env.LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'test_api_key';
process.env.LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'test_api_secret';

// Import the app logic from index.js, but without starting the server
// We'll need to refactor index.js to export the app for this to work
import app from '../index.js';

describe('POST /token', () => {
  it('should return a token for valid identity and room', async () => {
    const res = await request(app)
      .post('/token')
      .send({ identity: 'user1', room: 'room1' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(10);
  });

  it('should return 400 if identity is missing', async () => {
    const res = await request(app)
      .post('/token')
      .send({ room: 'room1' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('identity and room are required');
  });

  it('should return 400 if room is missing', async () => {
    const res = await request(app)
      .post('/token')
      .send({ identity: 'user1' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('identity and room are required');
  });
}); 
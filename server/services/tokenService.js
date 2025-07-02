import { AccessToken } from 'livekit-server-sdk';
import { config } from '../config.js';

export async function generateToken(identity, room, name) {
  if (!identity || !room) {
    throw new Error('identity and room are required');
  }

  const at = new AccessToken(
    config.livekit.apiKey || 'test', 
    config.livekit.apiSecret || 'test', 
    {
      identity,
      metadata: name ? JSON.stringify({ name }) : undefined,
    }
  );

  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
} 
import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private publisher: Redis;

  onModuleInit() {
    this.publisher = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    // Listen for connection errors
    this.publisher.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    // Optionally, listen for successful connection
    this.publisher.on('connect', () => {
      console.log('Connected to Redis successfully');
    });

    // Throw an error if Redis is not ready
    this.publisher.on('ready', () => {
      console.log('Redis is ready');
    });
  }

  onModuleDestroy() {
    // Gracefully close the Redis connection
    void this.publisher.quit();
  }

  publish(channel: string, message: any) {
    void this.publisher.publish(channel, JSON.stringify(message));
  }
}

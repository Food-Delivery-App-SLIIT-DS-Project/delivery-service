import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private publisher: Redis;
  private isReady = false;

  onModuleInit() {
    console.log('Initializing Redis connection...');
    this.publisher = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.publisher.on('error', (err) => {
      this.isReady = false;
      this.logger.error(`Redis error: ${err.message}`);
    });

    this.publisher.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.publisher.on('ready', () => {
      this.isReady = true;
      this.logger.log('Redis is ready ✅');
    });

    this.publisher.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });

    this.publisher.on('end', () => {
      this.logger.warn('Redis connection closed');
    });
  }

  onModuleDestroy() {
    if (this.publisher) {
      void this.publisher.quit();
      this.logger.log('Redis connection closed');
    }
  }

  isRedisReady(): boolean {
    return this.isReady;
  }

  async waitUntilReady(timeoutMs = 5000): Promise<void> {
    const start = Date.now();
    while (!this.isReady && Date.now() - start < timeoutMs) {
      await new Promise((res) => setTimeout(res, 100));
    }
    if (!this.isReady) {
      throw new Error('Redis connection timed out waiting for readiness');
    }
  }

  publish(channel: string, message: any) {
    if (!this.isReady) {
      this.logger.warn(`Redis not ready. Skipping publish to ${channel}.`);
      return;
    }
    console.log('Publishing to Redis channel:', channel, message);
    void this.publisher.publish(channel, JSON.stringify(message));
  }
}

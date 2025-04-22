import { ConfigModule } from '@nestjs/config';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryModule } from './delivery/delivery.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RedisModule,
    DeliveryModule,
    KafkaModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/default-db',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

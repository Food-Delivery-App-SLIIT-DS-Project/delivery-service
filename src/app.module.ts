import { ConfigModule } from '@nestjs/config';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryModule } from './delivery/delivery.module';
import { KafkaModule } from './kafka/kafka.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    DeliveryModule,
    KafkaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/default-db',
    ),
    VehicleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

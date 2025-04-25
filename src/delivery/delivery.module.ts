import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import {
  DeliveryPerson,
  DeliveryPersonSchema,
} from 'src/schema/delivery-person.schema';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DeliveryKafkaHandler } from 'src/event/handler';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: DeliveryPerson.name, schema: DeliveryPersonSchema },
    ]),
  ],
  controllers: [DeliveryController, DeliveryKafkaHandler],
  providers: [DeliveryService, RedisService],
  exports: [DeliveryService],
})
export class DeliveryModule {}

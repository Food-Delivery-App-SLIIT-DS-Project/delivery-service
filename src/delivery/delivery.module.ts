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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from 'src/types/user';
import { join } from 'path';

const url = process.env.USER_SERVICE_URL || 'localhost:50052';
@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: DeliveryPerson.name, schema: DeliveryPersonSchema },
    ]),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME, // You can inject with this name
        transport: Transport.GRPC,
        options: {
          url: url,
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../proto/user.proto'),
        },
      },
    ]),
  ],
  controllers: [DeliveryController, DeliveryKafkaHandler],
  providers: [DeliveryService, RedisService],
  exports: [DeliveryService],
})
export class DeliveryModule {}

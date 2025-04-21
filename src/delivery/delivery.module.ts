import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryController } from './controller/delivery.controller';
import { DeliveryService } from './service/delivery.service';
import {
  DeliveryPerson,
  DeliveryPersonSchema,
} from 'src/schema/delivery-person.schema';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DeliveryKafkaHandler } from 'src/event/handler';
import { VehicleController } from './controller/vehicle.controller';
import { VehicleService } from './service/vehicle.service';
import { Vehicle, VehicleSchema } from 'src/schema/vehicle.schema';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: DeliveryPerson.name, schema: DeliveryPersonSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [DeliveryController, DeliveryKafkaHandler, VehicleController],
  providers: [DeliveryService, VehicleService],
  exports: [DeliveryService, VehicleService],
})
export class DeliveryModule {}

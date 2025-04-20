import { Module } from '@nestjs/common';
import { DeliveryService } from './service/delivery.service';
import { DeliveryController } from './controller/delivery.controller';
import { VehicleController } from './controller/vehicle.controller';
import { VehicleService } from './service/vehicle.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './schema/vehicle.schema';
import { Delivery, DeliverySchema } from './schema/delivery.schema';

@Module({
  controllers: [DeliveryController, VehicleController],
  providers: [DeliveryService, VehicleService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
        collection: 'Vehicle',
      },
      {
        name: Delivery.name,
        schema: DeliverySchema,
        collection: 'Delivery',
      },
    ]),
  ],
})
export class DeliveryModule {}

import { Controller } from '@nestjs/common';
import { DeliveryService } from '../service/delivery.service';
import {
  CreateDeliveryDto,
  DeliveryList,
  DeliveryServiceController,
  DeliveryServiceControllerMethods,
  Empty2,
  FindOneDeliveryDto,
  UpdateDeliveryStatusDto,
} from 'src/types/delivery';

@Controller()
@DeliveryServiceControllerMethods()
export class DeliveryController implements DeliveryServiceController {
  constructor(private readonly deliveryService: DeliveryService) {}

  createDelivery(request: CreateDeliveryDto) {
    return this.deliveryService.create(request);
  }

  findAllDeliveries(request: Empty2): Promise<DeliveryList> {
    return this.deliveryService.findAll();
  }

  findDeliveryById(request: FindOneDeliveryDto) {
    return this.deliveryService.findOne(request);
  }

  updateDeliveryStatus(request: UpdateDeliveryStatusDto) {
    return this.deliveryService.updateDeliveryStatus(request);
  }
}

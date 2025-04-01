import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @MessagePattern('createDelivery')
  create(@Payload() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @MessagePattern('findAllDelivery')
  findAll() {
    return this.deliveryService.findAll();
  }

  @MessagePattern('findOneDelivery')
  findOne(@Payload() id: number) {
    return this.deliveryService.findOne(id);
  }

  @MessagePattern('updateDelivery')
  update(@Payload() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(updateDeliveryDto.id, updateDeliveryDto);
  }

  @MessagePattern('removeDelivery')
  remove(@Payload() id: number) {
    return this.deliveryService.remove(id);
  }
}

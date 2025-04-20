import { Injectable } from '@nestjs/common';
import {
  CreateDeliveryDto,
  DeliveryList,
  FindOneDeliveryDto,
  UpdateDeliveryStatusDto,
} from 'src/types/delivery';
import { Delivery as DeliveryModel } from '../schema/delivery.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(DeliveryModel.name)
    private readonly deliveryModel: Model<DeliveryModel>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    const created = await this.deliveryModel.create({
      ...createDeliveryDto,
      deliveryId: 'dl' + randomUUID(),
      createdAt: new Date(),
    });
    return {
      deliveryId: created.deliveryId,
      orderId: created.orderId,
      address: created.address,
      trackingId: created.trackingId,
      status: created.status,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async findAll(): Promise<DeliveryList> {
    return this.deliveryModel
      .find()
      .exec()
      .then((deliveries) => {
        const mappedDeliveries = deliveries.map((delivery) => ({
          deliveryId: delivery.deliveryId,
          orderId: delivery.orderId,
          address: delivery.address,
          trackingId: delivery.trackingId,
          status: delivery.status,
          createdAt: delivery.createdAt.toISOString(),
          updatedAt: delivery.updatedAt.toISOString(),
        }));

        return { deliveries: mappedDeliveries }; // wrap it!
      });
  }

  async findOne(request: FindOneDeliveryDto) {
    return this.deliveryModel
      .findById(request.deliveryId)
      .exec()
      .then((delivery) => {
        if (!delivery) {
          throw new Error('Delivery not found');
        }
        return {
          deliveryId: delivery.deliveryId,
          orderId: delivery.orderId,
          address: delivery.address,
          trackingId: delivery.trackingId,
          status: delivery.status,
          createdAt: delivery.createdAt.toISOString(),
          updatedAt: delivery.updatedAt.toISOString(),
        };
      });
  }

  async updateDeliveryStatus(request: UpdateDeliveryStatusDto) {
    const updated = await this.deliveryModel.findOneAndUpdate(
      { deliveryId: request.deliveryId },
      { status: request.status },
      { new: true },
    );
    if (!updated) {
      throw new Error('Delivery not found');
    }
    return {
      deliveryId: updated.deliveryId,
      orderId: updated.orderId,
      address: updated.address,
      trackingId: updated.trackingId,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}

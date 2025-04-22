import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';
import {
  DeliveryPerson,
  DeliveryPersonDocument,
} from 'src/schema/delivery-person.schema';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(DeliveryPerson.name)
    private readonly deliveryModel: Model<DeliveryPersonDocument>,
    private readonly redisService: RedisService, // <-- Injected here
  ) {}

  async goOnline(userId: string, coordinates: [number, number]) {
    const updated = await this.deliveryModel.findOneAndUpdate(
      { userId },
      {
        isOnline: true,
        location: {
          type: 'Point',
          coordinates,
        },
      },
      { upsert: true, new: true },
    );

    this.redisService.publish('driver.location.updated', {
      userId,
      isOnline: true,
      location: {
        type: 'Point',
        coordinates,
      },
    });

    return updated;
  }

  async goOffline(userId: string) {
    const updated = await this.deliveryModel.findOneAndUpdate(
      { userId },
      { isOnline: false },
      { new: true },
    );

    this.redisService.publish('driver.location.updated', {
      userId,
      isOnline: false,
    });

    return updated;
  }

  async updateLocation(userId: string, coordinates: [number, number]) {
    const updated = await this.deliveryModel.findOneAndUpdate(
      { userId },
      {
        location: {
          type: 'Point',
          coordinates,
        },
      },
      { new: true },
    );

    this.redisService.publish('driver.location.updated', {
      userId,
      isOnline: updated?.isOnline ?? false,
      location: {
        type: 'Point',
        coordinates,
      },
    });

    return updated;
  }

  async findNearest(lat: number, lng: number, maxDistanceInMeters = 5000) {
    return this.deliveryModel.find({
      isOnline: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistanceInMeters,
        },
      },
    });
  }
}

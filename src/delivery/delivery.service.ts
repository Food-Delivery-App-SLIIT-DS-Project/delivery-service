import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DeliveryPerson,
  DeliveryPersonDocument,
} from 'src/schema/delivery-person.schema';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(DeliveryPerson.name)
    private readonly deliveryModel: Model<DeliveryPersonDocument>,
  ) {}

  async goOnline(userId: string, coordinates: [number, number]) {
    return this.deliveryModel.findOneAndUpdate(
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
  }

  async goOffline(userId: string) {
    return this.deliveryModel.findOneAndUpdate(
      { userId },
      { isOnline: false },
      { new: true },
    );
  }

  async updateLocation(userId: string, coordinates: [number, number]) {
    return this.deliveryModel.findOneAndUpdate(
      { userId },
      {
        location: {
          type: 'Point',
          coordinates,
        },
      },
      { new: true },
    );
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

/* eslint-disable prettier/prettier */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';
import {
  DeliveryPerson,
  DeliveryPersonDocument,
} from 'src/schema/delivery-person.schema';
import {
  FcmTokenResponse,
  USER_SERVICE_NAME,
  UserResponse,
  UserServiceClient,
} from 'src/types/user';

@Injectable()
export class DeliveryService implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(
    @InjectModel(DeliveryPerson.name)
    private readonly deliveryModel: Model<DeliveryPersonDocument>,
    private readonly redisService: RedisService,
    @Inject(USER_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userServiceClient =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
  // get fcm token
  async getFcmToken(userId: string) {
    // eslint-disable-next-line no-useless-catch
    console.log(userId);
    // eslint-disable-next-line no-useless-catch
    try {
      const fcmTokenResponse: FcmTokenResponse = await lastValueFrom(
        this.userServiceClient.findFcmTokenByUserId({ userId }),
      );

      if (!fcmTokenResponse) {
        throw new NotFoundException('User not found');
      }
      console.log('FCM Token:', fcmTokenResponse);
      return fcmTokenResponse.fcmToken;
    } catch (error) {
      console.error('Error fetching FCM token:', error);
      throw error; // optionally handle/log error here
    }
  }

  // Helper to validate coordinates
  private validateCoordinates(coordinates: [number, number]) {
    if (
      !coordinates ||
      coordinates.length !== 2 ||
      typeof coordinates[0] !== 'number' ||
      typeof coordinates[1] !== 'number' ||
      isNaN(coordinates[0]) ||
      isNaN(coordinates[1])
    ) {
      throw new InternalServerErrorException(
        'Invalid location coordinates provided',
      );
    }
  }

  // Go Online with location
  async goOnline(userId: string, coordinates: [number, number]) {
    console.log('Go online:', userId, coordinates);
    this.validateCoordinates(coordinates);

    try {
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
      await this.redisService.waitUntilReady();
      this.redisService.publish('driver.location.updated', {
        userId,
        isOnline: true,
        location: {
          type: 'Point',
          coordinates,
        },
      });

      return updated;
    } catch (error) {
      console.error('Failed to go online:', error);
      throw new InternalServerErrorException('Could not set driver online');
    }
  }

  // Go Offline
  async goOffline(userId: string) {
    console.log('Go offline:', userId);
    try {
      const updated = await this.deliveryModel.findOneAndUpdate(
        { userId },
        { isOnline: false },
        { new: true },
      );

      if (!updated) {
        throw new NotFoundException('User not found');
      }
      await this.redisService.waitUntilReady();
      this.redisService.publish('driver.location.updated', {
        userId,
        isOnline: false,
      });

      return updated;
    } catch (error) {
      console.error('Failed to go offline:', error);
      throw new InternalServerErrorException('Could not set driver offline');
    }
  }

  // Update current location
  async updateLocation(userId: string, coordinates: [number, number]) {
    this.validateCoordinates(coordinates);

    try {
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

      if (!updated) {
        throw new NotFoundException('User not found for location update');
      }
      await this.redisService.waitUntilReady();
      this.redisService.publish('driver.location.updated', {
        userId,
        isOnline: updated?.isOnline ?? false,
        location: {
          type: 'Point',
          coordinates,
        },
      });
      // console.log('Location updated:', updated);
      return updated;
    } catch (error) {
      console.error('Failed to update location:', error);
      throw new InternalServerErrorException(
        'Could not update driver location',
      );
    }
  }

  // Find nearest delivery persons within radius
  async findNearest(lat: number, lng: number, maxDistanceInMeters = 50000) {
    this.validateCoordinates([lng, lat]);
    console.log(
      'Finding nearest delivery persons:',
      lat,
      lng,
      maxDistanceInMeters,
    );

    try {
      const nearby = await this.deliveryModel.find({
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
      console.log(nearby);
      return nearby;
    } catch (error) {
      console.error('Error finding nearest delivery personnel:', error);
      throw new InternalServerErrorException(
        'Failed to find nearby delivery persons',
      );
    }
  }

  // Get customer ------------
  async getCustomerById(customerId: string) {
    try {
      const customer: UserResponse = await lastValueFrom(
        this.userServiceClient.findUserById({ userId: customerId }),
      );

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      return customer;
    } catch (error) {
      console.log('Error fetching customer:', error);
    }
  }
}

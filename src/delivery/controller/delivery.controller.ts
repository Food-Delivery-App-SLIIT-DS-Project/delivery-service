import { Controller } from '@nestjs/common';
import { DeliveryService } from '../service/delivery.service';
import { from, map, Observable } from 'rxjs';
import {
  DeliveryServiceController,
  DeliveryServiceControllerMethods,
  DeliveryStatusResponse,
  GetNearestRequest,
  NearestDeliveryList,
  OfflineStatusRequest,
  OnlineStatusRequest,
  UpdateLocationRequest,
} from 'src/types';

@DeliveryServiceControllerMethods()
@Controller()
export class DeliveryController implements DeliveryServiceController {
  constructor(private readonly deliveryService: DeliveryService) {}

  goOnline(data: OnlineStatusRequest): Observable<DeliveryStatusResponse> {
    return from(
      this.deliveryService.goOnline(data.userId, [data.lng, data.lat]),
    ).pipe(
      map((res) => ({
        userId: res.userId,
        isOnline: res.isOnline,
        message: 'User is now online',
      })),
    );
  }

  goOffline(data: OfflineStatusRequest): Observable<DeliveryStatusResponse> {
    return from(this.deliveryService.goOffline(data.userId)).pipe(
      map((res) => ({
        userId: res?.userId ?? '',
        isOnline: res?.isOnline ?? false,
        message: 'User is now offline',
      })),
    );
  }

  updateLocation(
    data: UpdateLocationRequest,
  ): Observable<DeliveryStatusResponse> {
    return from(
      this.deliveryService.updateLocation(data.userId, [data.lng, data.lat]),
    ).pipe(
      map((res) => ({
        userId: res?.userId ?? '',
        isOnline: res?.isOnline ?? false,
        message: 'Location updated',
      })),
    );
  }

  getNearest(data: GetNearestRequest): Observable<NearestDeliveryList> {
    return from(
      this.deliveryService.findNearest(data.lat, data.lng, data.radius || 5000),
    ).pipe(
      map((results) => ({
        list: results.map((person) => ({
          userId: person.userId,
          lat: person.location.coordinates[1],
          lng: person.location.coordinates[0],
        })),
      })),
    );
  }
}

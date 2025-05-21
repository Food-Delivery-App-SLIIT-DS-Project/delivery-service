/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { DeliveryService } from 'src/delivery/delivery.service';

@Controller()
export class DeliveryKafkaHandler {
  constructor(
    private readonly deliveryService: DeliveryService,
    @Inject('KAFKA_SERVICE_DELIVERY') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('DeliveryKafkaHandler initialized');
  }

  @EventPattern('ORDER_ACCEPTED')
  async handleOrderAccepted(@Payload() data: any) {
    console.log('📦 Received ORDER_ACCEPTED payload:', data);

    const location = data?.location;
    const order = data?.order;
    const restaurantId = data?.restaurantId;
    console.log('📦 Received ORDER_ACCEPTED payload:', order);

    if (!location) {
      console.warn('❌ Invalid or missing location data:', data);
      return; // ⬅️ Don't crash! Just return to acknowledge the message
    }

    const { latitude, longitude } = location;
    const radius = 5000;
    console.log(location);
    try {
      const nearbyDelivery = await this.deliveryService.findNearest(
        latitude,
        longitude,
        radius,
      );

      console.log('🛵 Nearby Delivery People:', nearbyDelivery);
      if (!nearbyDelivery?.length) {
        console.warn('No available riders nearby');
        return;
      }

      const selectedRider = nearbyDelivery[0];

      // get fcmToekn by userId
      const fcmToken = await this.deliveryService.getFcmToken(
        selectedRider.userId,
      );
      if (!fcmToken) {
        console.warn('No FCM token found for the selected rider');
        return;
      }
      const customer = await this.deliveryService.getCustomerById(
        order.customerId,
      );
      if (!customer) {
        console.warn('No customer found for the order');
        return;
      }

      const dataFormate = {
        data: {
          token: fcmToken,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          orderId: order.orderId,
          total: order.totalPrice,
          customerName: customer.fullName,
          customerMobile: customer.phoneNumber,
          pickupLocation: {
            lat: order.latitude,
            lng: order.longitude,
          },
          dropoffLocation: {
            lat: order.latitude,
            lng: order.longitude,
          },
        },
      };
      console.log('🚚 Sending delivery assignment: ----------', dataFormate);
      await this.kafkaClient.emit('DELIVERY_ASSIGNED', dataFormate);
    } catch (err) {
      console.error('🚨 Failed to handle order accepted:', err);
      // Optionally rethrow: throw err
    }
  }
}

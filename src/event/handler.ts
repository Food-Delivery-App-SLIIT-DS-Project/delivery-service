/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { DeliveryService } from 'src/delivery/service/delivery.service';

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
  const orderId = data?.orderId;

  if (!location) {
    console.warn('❌ Invalid or missing location data:', data);
    return; // ⬅️ Don't crash! Just return to acknowledge the message
  }

  const { lat, lng } = location;
  const radius = 500;

  try {
    const nearbyDelivery = await this.deliveryService.findNearest(lat, lng, radius);

    console.log('🛵 Nearby Delivery People:', nearbyDelivery);
    if (!nearbyDelivery?.length) {
      console.warn('No available riders nearby');
      return;
    }

    const selectedRider = nearbyDelivery[0];

    await this.kafkaClient.emit('DELIVERY_ASSIGNED', {
      userId: selectedRider.userId,
      orderId,
      pickupLocation: location,
    });
  } catch (err) {
    console.error('🚨 Failed to handle order accepted:', err);
    // Optionally rethrow: throw err
  }
}
}

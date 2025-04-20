import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export enum DeliveryStatusEnum {
//   PENDING = 0, // default
//   PICKED_UP = 1,
//   IN_TRANSIT = 2,
//   DELIVERED = 3,
//   CANCELLED = 4,
// }

@Schema()
export class Delivery {
  @Prop({ unique: true })
  deliveryId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  address: string; // VehicleTypeEnum

  @Prop({ required: true })
  trackingId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

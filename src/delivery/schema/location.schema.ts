import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Double } from 'mongoose';

@Schema()
export class VehicleLocation {
  @Prop({ unique: true })
  trackingId: string;

  @Prop({ required: true })
  vehicleId: string;

  @Prop({ required: true })
  latitude: Double; // VehicleTypeEnum

  @Prop({ required: true })
  longitude: Double;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VehicleLocationSchema = SchemaFactory.createForClass(VehicleLocation);

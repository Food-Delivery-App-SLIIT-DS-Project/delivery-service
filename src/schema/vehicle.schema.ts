import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export enum VehicleTypeEnum {
//   BIKE = "BIKE",
//   CAR = "CAR",
//   SCOOTER = "SCOOTER",
//   BICYCLE = "BICYCLE",
// }

@Schema()
export class Vehicle {
  @Prop({ unique: true })
  vehicleId: string;

  @Prop({ required: true })
  driverId: string;

  @Prop({ required: true })
  vehicleType: string; // VehicleTypeEnum

  @Prop({ required: true })
  brandName: string;

  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  registrationNumber: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  insuranceNumber: string;

  @Prop({ required: true })
  insuranceExpiry: Date;

  @Prop()
  availability: boolean;

  @Prop()
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

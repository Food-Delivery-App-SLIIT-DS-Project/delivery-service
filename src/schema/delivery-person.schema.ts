import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryPersonDocument = DeliveryPerson & Document;

@Schema({ timestamps: true })
export class DeliveryPerson {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop(
    raw({
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    }),
  )
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const DeliveryPersonSchema =
  SchemaFactory.createForClass(DeliveryPerson);
DeliveryPersonSchema.index({ location: '2dsphere' });

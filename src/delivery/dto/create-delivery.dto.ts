import { IsDate, IsNotEmpty, IsString } from 'class-validator';


export class CreateDeliveryDto {
    
    @IsString()
    @IsNotEmpty()
    deliveryId: string;
    
    @IsString()
    @IsNotEmpty()
    orderId: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;
    
    @IsString()
    @IsNotEmpty()
    trackingId: string;

    @IsString()
    @IsNotEmpty()
    status: DeliveryStatusEnum;
    
    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}

export enum DeliveryStatusEnum {
    PENDING = 0, // default
    PICKED_UP = 1,
    IN_TRANSIT = 2,
    DELIVERED = 3,
    CANCELLED = 4,
  }
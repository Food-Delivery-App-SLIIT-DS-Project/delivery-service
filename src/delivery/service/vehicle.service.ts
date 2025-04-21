import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle as VehicleModel } from '../../schema/vehicle.schema';

import {
  CreateVehicleDto,
  UpdateVehicleAvailabilityDto,
  Vehicle,
  VehicleList,
  VehicleLocation,
} from 'src/types/vehicle';
import { randomUUID } from 'crypto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(VehicleModel.name)
    private readonly vehicleModel: Model<VehicleModel>,
  ) {}

  async createVehicle(request: CreateVehicleDto) {
    console.log('Received request:', request);

    const created = await this.vehicleModel.create({
      ...request,
      vehicleId: 'vh' + randomUUID(),
      createdAt: new Date(),
      availability: true,
    });

    return {
      vehicleId: created.vehicleId,
      driverId: created.driverId,
      vehicleType: created.vehicleType,
      brandName: created.brandName,
      modelName: created.modelName,
      registrationNumber: created.registrationNumber,
      color: created.color,
      year: created.year,
      insuranceNumber: created.insuranceNumber,
      insuranceExpiry: created.insuranceExpiry.toISOString(),
      availability: created.availability,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async findVehicleById(request: { vehicleId: string }) {
    const vehicle = await this.vehicleModel
      .findOne({ vehicleId: request.vehicleId })
      .exec();
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return {
      vehicleId: vehicle.vehicleId,
      driverId: vehicle.driverId,
      vehicleType: vehicle.vehicleType,
      brandName: vehicle.brandName,
      modelName: vehicle.modelName,
      registrationNumber: vehicle.registrationNumber,
      color: vehicle.color,
      year: vehicle.year,
      insuranceNumber: vehicle.insuranceNumber,
      insuranceExpiry: vehicle.insuranceExpiry.toISOString(),
      availability: vehicle.availability,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  async findVehicleByDriverId(request: { driverId: string }) {
    const vehicle = await this.vehicleModel
      .findOne({ driverId: request.driverId })
      .exec();
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return {
      vehicleId: vehicle.vehicleId,
      driverId: vehicle.driverId,
      vehicleType: vehicle.vehicleType,
      brandName: vehicle.brandName,
      modelName: vehicle.modelName,
      registrationNumber: vehicle.registrationNumber,
      color: vehicle.color,
      year: vehicle.year,
      insuranceNumber: vehicle.insuranceNumber,
      insuranceExpiry: vehicle.insuranceExpiry.toISOString(),
      availability: vehicle.availability,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  async findAllVehicles(): Promise<VehicleList> {
    const vehicles = await this.vehicleModel.find().exec();
    return {
      vehicles: vehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,
        driverId: vehicle.driverId,
        vehicleType: vehicle.vehicleType,
        brandName: vehicle.brandName,
        modelName: vehicle.modelName,
        registrationNumber: vehicle.registrationNumber,
        color: vehicle.color,
        year: vehicle.year,
        insuranceNumber: vehicle.insuranceNumber,
        insuranceExpiry: vehicle.insuranceExpiry.toISOString(),
        availability: vehicle.availability,
        createdAt: vehicle.createdAt.toISOString(),
        updatedAt: vehicle.updatedAt.toISOString(),
      })),
    };
  }

  async findAvailableVehicles(): Promise<VehicleList> {
    const vehicles = await this.vehicleModel
      .find({ availability: true })
      .exec();
    return {
      vehicles: vehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,
        driverId: vehicle.driverId,
        vehicleType: vehicle.vehicleType,
        brandName: vehicle.brandName,
        modelName: vehicle.modelName,
        registrationNumber: vehicle.registrationNumber,
        color: vehicle.color,
        year: vehicle.year,
        insuranceNumber: vehicle.insuranceNumber,
        insuranceExpiry: vehicle.insuranceExpiry.toISOString(),
        availability: vehicle.availability,
        createdAt: vehicle.createdAt.toISOString(),
        updatedAt: vehicle.updatedAt.toISOString(),
      })),
    };
  }

  async updateVehicleAvailability(request: UpdateVehicleAvailabilityDto) {
    const vehicle = await this.vehicleModel
      .findOneAndUpdate(
        { vehicleId: request.vehicleId },
        { availability: request.availability },
        { new: true },
      )
      .exec();
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return {
      vehicleId: vehicle.vehicleId,
      driverId: vehicle.driverId,
      vehicleType: vehicle.vehicleType,
      brandName: vehicle.brandName,
      modelName: vehicle.modelName,
      registrationNumber: vehicle.registrationNumber,
      color: vehicle.color,
      year: vehicle.year,
      insuranceNumber: vehicle.insuranceNumber,
      insuranceExpiry: vehicle.insuranceExpiry.toISOString(),
      availability: vehicle.availability,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  async deleteVehicle(request: { vehicleId: string }): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findOneAndDelete({ vehicleId: request.vehicleId }).exec();
  
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
  
    // Transform the Mongoose document to plain `Vehicle`
    return {
      vehicleId: vehicle.vehicleId,
      driverId: vehicle.driverId,
      vehicleType: vehicle.vehicleType,
      brandName: vehicle.brandName,
      modelName: vehicle.modelName, 
      registrationNumber: vehicle.registrationNumber,
      color: vehicle.color,
      year: vehicle.year,
      insuranceNumber: vehicle.insuranceNumber,
      insuranceExpiry: vehicle.insuranceExpiry.toISOString(), // since proto expects string
      availability: vehicle.availability,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }
  
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CreateVehicleDto,
  FindOneVehicleDto,
  FindVehicleByDriverIdDto,
  UpdateVehicleAvailabilityDto,
  Vehicle,
  VehicleList,
  VehicleLocation,
  VehicleServiceController,
  VehicleServiceControllerMethods,
} from 'src/types/vehicle';
import { VehicleService } from './vehicle.service';

@Controller()
@VehicleServiceControllerMethods()
export class VehicleController implements VehicleServiceController {
  constructor(private readonly vehicleService: VehicleService) {}

  async createVehicle(request: CreateVehicleDto): Promise<Vehicle> {
    try {
      return await this.vehicleService.createVehicle(request);
    } catch (error) {
      throw new RpcException(error?.message || 'Failed to create vehicle');
    }
  }

  async findVehicleById(request: FindOneVehicleDto): Promise<Vehicle> {
    try {
      return await this.vehicleService.findVehicleById(request);
    } catch (error) {
      throw new RpcException(error?.message || 'Vehicle not found');
    }
  }

  async findVehicleByDriverId(
    request: FindVehicleByDriverIdDto,
  ): Promise<Vehicle> {
    try {
      return await this.vehicleService.findVehicleByDriverId(request);
    } catch (error) {
      throw new RpcException(error?.message || 'Vehicle for driver not found');
    }
  }

  async findAllVehicles(): Promise<VehicleList> {
    try {
      return await this.vehicleService.findAllVehicles();
    } catch (error) {
      throw new RpcException(error?.message || 'Could not fetch vehicles');
    }
  }

  async findAvailableVehicles(): Promise<VehicleList> {
    try {
      return await this.vehicleService.findAvailableVehicles();
    } catch (error) {
      throw new RpcException(
        error?.message || 'Could not fetch available vehicles',
      );
    }
  }

  async updateVehicleAvailability(
    request: UpdateVehicleAvailabilityDto,
  ): Promise<Vehicle> {
    try {
      return await this.vehicleService.updateVehicleAvailability(request);
    } catch (error) {
      throw new RpcException(
        error?.message || 'Failed to update vehicle availability',
      );
    }
  }

  async deleteVehicle(request: FindOneVehicleDto): Promise<Vehicle> {
    try {
      return await this.vehicleService.deleteVehicle(request);
    } catch (error) {
      throw new RpcException(error?.message || 'Failed to delete vehicle');
    }
  }

  // Unimplemented methods return RpcException to keep the service stable
  updateVehicleLocation(request: VehicleLocation): Promise<VehicleLocation> {
    throw new RpcException('updateVehicleLocation not implemented');
  }

  findVehicleLocation(request: FindOneVehicleDto): Promise<VehicleLocation> {
    throw new RpcException('findVehicleLocation not implemented');
  }

  findAllVehicleLocations(): Promise<VehicleLocation> {
    throw new RpcException('findAllVehicleLocations not implemented');
  }

  deleteVehicleLocation(request: FindOneVehicleDto): Promise<VehicleLocation> {
    throw new RpcException('deleteVehicleLocation not implemented');
  }
}

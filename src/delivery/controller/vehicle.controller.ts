import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  CreateVehicleDto,
  Empty2 as Empty,
  FindOneVehicleDto,
  FindVehicleByDriverIdDto,
  UpdateVehicleAvailabilityDto,
  Vehicle,
  VehicleList,
  VehicleLocation,
  VehicleServiceController,
  VehicleServiceControllerMethods,
} from 'src/types/vehicle';
import { VehicleService } from '../service/vehicle.service';
import { Observable } from 'rxjs';

@Controller()
@VehicleServiceControllerMethods()
export class VehicleController implements VehicleServiceController {

  constructor(private readonly vehicleService: VehicleService) {}
  
  //vehicle management
  createVehicle(request: CreateVehicleDto) {
    return this.vehicleService.createVehicle(request);
  }

  findVehicleById(request: FindOneVehicleDto) {
   return this.vehicleService.findVehicleById(request);
  }

  findVehicleByDriverId(request: FindVehicleByDriverIdDto) {
    return this.vehicleService.findVehicleByDriverId(request);
  }

  findAllVehicles(request: Empty): Promise<VehicleList> {
    return this.vehicleService.findAllVehicles();
  }

  findAvailableVehicles(request: Empty): Promise<VehicleList> {
    return this.vehicleService.findAvailableVehicles();
  }
  
  updateVehicleAvailability(request: UpdateVehicleAvailabilityDto){
    return this.vehicleService.updateVehicleAvailability(request);
  }

  deleteVehicle(request: FindOneVehicleDto) {
    return this.vehicleService.deleteVehicle(request);
  }


  //vehicle locations
  updateVehicleLocation(request: VehicleLocation): Promise<VehicleLocation> | Observable<VehicleLocation> | VehicleLocation {
    throw new Error('Method not implemented.');
  }
  findVehicleLocation(request: FindOneVehicleDto): Promise<VehicleLocation> | Observable<VehicleLocation> | VehicleLocation {
    throw new Error('Method not implemented.');
  }
  findAllVehicleLocations(request: Empty): Promise<VehicleLocation> | Observable<VehicleLocation> | VehicleLocation {
    throw new Error('Method not implemented.');
  }
  deleteVehicleLocation(request: FindOneVehicleDto): Promise<VehicleLocation> | Observable<VehicleLocation> | VehicleLocation {
    throw new Error('Method not implemented.');
  }

  
}

import { VehicleExpense } from './index';

export class Vehicle {
    _id: string;
    name: string;
    model: string;
    licensePlate: string;
    licenseExpireDate: Date;
    numberOfSeats: Number;
    productionYear: Number;
    numberOfKmPassed: Number;
    expenses: Array<VehicleExpense>;
}

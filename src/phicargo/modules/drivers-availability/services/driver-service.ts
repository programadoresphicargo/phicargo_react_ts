import { AxiosError } from "axios";
import { Driver } from "../models/driver-model";
import { DriverApi } from "../models/api/driver-model-api";
import { driverToLocal } from "../adapters/drivers/driver-mapper";
import odooApi from "../../core/api/odoo-api";

class DriverServiceApi {

  static async getAllDrivers(): Promise<Driver[]> {
    try { 
      const response = await odooApi.get<DriverApi[]>('/drivers/');
      return response.data.map(driverToLocal);
    } catch (error) {
      console.log(error);
      if( error instanceof AxiosError ){
        throw new Error(error.response?.data?.message || 'Error getting drivers');
      }
      throw new Error('Error getting drivers');
    }
  }

}

export default DriverServiceApi;

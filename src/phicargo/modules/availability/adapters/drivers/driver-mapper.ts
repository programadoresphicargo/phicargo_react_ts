import type { Driver, DriverEdit } from "../../models/driver-model";
import type { DriverApi, DriverEditApi } from "../../models/api/driver-model-api";

export const driverToLocal = (driver: DriverApi): Driver => ({
  id: driver.id,
  name: driver.name,
  jobId: driver.job_id,
  job: driver.job,
  isActive: driver.active,
  company: driver.company,
  driverLicenseId: driver.tms_driver_license_id || 'SIN ASIGNAR',
  driverLicenseType: driver.tms_driver_license_type || 'SIN ASIGNAR',
  driverLicenseExpiration: driver.tms_driver_license_expiration
    ? new Date(driver.tms_driver_license_expiration)
    : null,
  isDriver: driver.is_driver || false,
  noLicense: driver.no_license || 'SIN ASIGNAR',
  modality: driver.x_modalidad || 'SIN ASIGNAR',
  isDangerous: driver.x_peligroso_lic || 'SIN ASIGNAR',
  status: driver.x_status || 'SIN ASIGNAR',
  viaje: driver.x_viaje || 0,
  maniobra: driver.x_maniobra || 0,
  vehicleId: driver.vehicle_id || 0,
  vehicleName: driver.vehicle_name || 'SIN ASIGNAR',
  vehicleActive: driver.vehicle_active || false,
});

export const driverUpdateToApi = (driver: DriverEdit): DriverEditApi => ({
  job_id: driver.jobId,
  tms_driver_license_id: driver.driverLicenseId,
  tms_driver_license_type: driver.driverLicenseType,
  x_modalidad: driver.modality,
  x_peligroso_lic: driver.isDangerous,
});

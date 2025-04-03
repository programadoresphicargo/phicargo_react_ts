import type {
  Workshop,
  WorkshopApi,
  WorkshopCreate,
  WorkshopCreateApi,
} from '../../models';

/**
 * Mapper to convert an object of type WorkshopApi to Workshop
 * @param workshop Object of type WorkshopApi
 * @returns Object of type Workshop
 */
export const workshopToLocal = (workshop: WorkshopApi): Workshop => ({
  id: workshop?.id,
  name: workshop?.name,
});

/**
 * Mapper to convert an object of type WorkshopCreate to WorkshopCreateApi
 * @param workshop Object of type WorkshopCreate
 * @returns Object of type WorkshopCreateApi
 */
export const workshopToApi = (workshop: WorkshopCreate): WorkshopCreateApi => ({
  name: workshop.name,
});

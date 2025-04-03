import { Shift } from '../models';
import axios from 'axios';

type PhoneNumber = {
  id: number;
  phone: number;
};

type Response = {
  success: boolean;
  data: PhoneNumber[];
};

/**
 * Functions Service to get phone numbers from drivers
 * @param shifts Array of shifts
 * @returns Array of phone numbers
 */
export const getPhoneNumbers = async (
  shifts: Shift[],
): Promise<PhoneNumber[]> => {
  const driverNames = shifts.map((shift) => ({
    id: shift.id,
    name: shift.driver.name,
  }));

  const requestBody = {
    empleados: driverNames,
  };

  try {
    const response = await axios.post<Response>(
      'https://phides.phicargo-sistemas.online/phicargo/turnos/phones/get_phones.php',
      requestBody,
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting phone numbers');
  }
};

import type {
  Confirmation,
  Payment,
  PaymentApi,
  PaymentCreate,
} from '../models';
import {
  paymentConfirmationToApi,
  paymentToApi,
  paymentToApiFull,
  paymentToLocal,
} from '../adapters';

import { AxiosError } from 'axios';
import { UpdatableItem } from '@/types';
import odooApi from '@/api/odoo-api';

/**
 * API Service for Payment Module
 */
class PaymentServiceApi {
  /**
   * Method to get the payment registers of a week
   * @param weekId ID of the week to get the payment registers
   * @returns Array of Payment Registers
   */
  public static async getRegisterByWeekId(weekId: number, companyId: number): Promise<Payment[]> {
    try {
      const response = await odooApi.get<PaymentApi[]>(
        `/accounting_report/payments?week_id=${weekId}&company_id=${companyId}`,
      );
      return response.data.map(paymentToLocal);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al obtener registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to create a new payment register
   * @param payment Object with the data of the new register
   * @returns Object with the data of the created register
   */
  public static async createRegister(payment: PaymentCreate): Promise<Payment> {
    const body = paymentToApi(payment);

    try {
      const response = await odooApi.post<PaymentApi>(
        '/accounting_report/payments',
        body,
      );
      console.error(response.data);
      return paymentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al crear registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to update a payment register
   * @param param0 Object with the data of the register to update
   * @returns Object with the data of the updated register
   */
  public static async updateRegister({
    id,
    updatedItem,
  }: UpdatableItem<Partial<PaymentCreate>>): Promise<Payment> {
    const body = paymentToApiFull(updatedItem as Payment);
    try {
      const response = await odooApi.put<PaymentApi>(
        `/accounting_report/payments/${id}`,
        body,
      );
      return paymentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al actualizar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to delete a payment register
   * @param id ID of the payment register to delete
   * @returns True if the register was deleted
   */
  public static async deleteRegister(id: number): Promise<boolean> {
    try {
      await odooApi.delete(`/accounting_report/payments/${id}`);
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al eliminar registro',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to confirm a payment
   * @param confirmation Object with the data of the confirmation
   * @returns Object with the data of the confirmed payment
   */
  public static async confirmPayment(
    confirmation: Confirmation,
  ): Promise<Payment> {
    const body = paymentConfirmationToApi(confirmation);
    try {
      const response = await odooApi.post<PaymentApi>(
        `/accounting_report/payments/${confirmation.itemId}/confirm`,
        body,
      );
      return paymentToLocal(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al confirmar pago',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }

  /**
   * Method to load the previous week registers
   * @param param0 Object with the previous week id and the active week id
   * @returns Number of registers loaded
   */
  public static async loadPreviousWeek({
    previousWeekId,
    activeWeekId,
    companyId,
  }: {
    previousWeekId: number;
    activeWeekId: number;
    companyId: number;
  }): Promise<number> {
    try {
      const response = await odooApi.post<number>(
        `/accounting_report/payments/load_previous/payments?previous_week_id=${previousWeekId}&new_week_id=${activeWeekId}&company_id=${companyId}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data.detail || 'Error al cargar registros',
        );
      }
      throw new Error('Error inesperado con el servidor');
    }
  }
}

export default PaymentServiceApi;

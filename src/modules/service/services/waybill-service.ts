import type {
  Route,
  Waybill,
  WaybillCategory,
  WaybillCreate,
  WaybillEdit,
  WaybillItem,
  WaybillTransportableProduct,
} from '../models';
import type {
  RouteApi,
  WaybillApi,
  WaybillCategoryApi,
  WaybillItemApi,
  WaybillServiceApi,
  WaybillTransportableProductApi,
} from '../models/api';
import {
  ServiceAdapter,
  ServiceRequestAdapter,
  WaybillAdapter,
} from '../adapters';

import { AxiosError } from 'axios';
import { UpdatableItem } from '@/types';
import { WaybillItemKey } from '../types';
import odooApi from '@/api/odoo-api';

export class WaybillService {
  public static async getWaybillServices([startDate, endDate]: [
    Date,
    Date,
  ]): Promise<WaybillService[]> {
    const strStartDate = startDate.toISOString().split('T')[0];
    const strEndDate = endDate.toISOString().split('T')[0];

    const url = `/tms_waybill/services?start_date=${strStartDate}&end_date=${strEndDate}`;

    try {
      const response = await odooApi.get<WaybillServiceApi[]>(url);
      return response.data.map(ServiceAdapter.toWaybillService);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los servicios',
        );
      }
      throw new Error('Error al obtener los servicios');
    }
  }

  public static async getServiceRequests([startDate, endDate]: [
    Date,
    Date,
  ]): Promise<Waybill[]> {
    const strStartDate = startDate.toISOString().split('T')[0];
    const strEndDate = endDate.toISOString().split('T')[0];

    const url = `/service-request/?start_date=${strStartDate}&end_date=${strEndDate}`;

    try {
      const response = await odooApi.get<WaybillApi[]>(url);
      return response.data.map(ServiceRequestAdapter.toWaybill);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las solicitudes de servicio',
        );
      }
      throw new Error('Error al obtener las solicitudes de servicio');
    }
  }

  public static async createService(data: WaybillCreate) {
    const body = ServiceRequestAdapter.toWaybillCreate(data);
    console.log(body);
    try {
      const response = await odooApi.post('/service-request/', body);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al crear el servicio',
        );
      }
      throw new Error('Error al crear el servicio');
    }
  }

  public static async updateService({
    id,
    updatedItem,
  }: UpdatableItem<WaybillEdit>): Promise<Waybill> {
    const body = ServiceRequestAdapter.toWaybillEdit(updatedItem);
    try {
      const response = await odooApi.patch<WaybillApi>(
        `/service-request/${id}`,
        body,
      );
      return ServiceRequestAdapter.toWaybill(response.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al actualizar el servicio',
        );
      }
      throw new Error('Error al actualizar el servicio');
    }
  }

  public static async getCategories(): Promise<WaybillCategory[]> {
    try {
      const response = await odooApi.get<WaybillCategoryApi[]>(
        '/tms_waybill/category',
      );
      return response.data.map(WaybillAdapter.toWaybillCategory);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener las categorías carta porte',
        );
      }
      throw new Error('Error al obtener las categorías carta porte');
    }
  }

  public static async getTransportableProducts(): Promise<
    WaybillTransportableProduct[]
  > {
    try {
      const response = await odooApi.get<WaybillTransportableProductApi[]>(
        '/tms_waybill/transportable-product',
      );
      return response.data.map(WaybillAdapter.toWaybillTransportableProduct);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail ||
            'Error al obtener los productos transportables',
        );
      }
      throw new Error('Error al obtener los productos transportables');
    }
  }

  public static async getRoutes(): Promise<Route[]> {
    try {
      const response = await odooApi.get<RouteApi[]>('/tms_waybill/route');
      return response.data.map(WaybillAdapter.toRoute);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener las rutas',
        );
      }
      throw new Error('Error al obtener las rutas');
    }
  }

  public static async getWaybillItems(
    key: WaybillItemKey,
    searchTerm: string,
  ): Promise<WaybillItem[]> {
    const url = `/tms_waybill/${key}?search_term=${searchTerm}`;

    try {
      const response = await odooApi.get<WaybillItemApi[]>(url);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.detail || 'Error al obtener los items',
        );
      }
      throw new Error('Error al obtener los items');
    }
  }
}


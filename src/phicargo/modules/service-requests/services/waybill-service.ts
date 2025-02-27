import type {
  Route,
  WaybillCategory,
  WaybillCreate,
  WaybillItem,
  WaybillTransportableProduct,
} from '../models';
import type {
  RouteApi,
  WaybillCategoryApi,
  WaybillItemApi,
  WaybillTransportableProductApi,
} from '../models/api';
import { ServiceRequestAdapter, WaybillAdapter } from '../adapters';

import { AxiosError } from 'axios';
import { WaybillItemKey } from '../types';
import odooApi from '../../core/api/odoo-api';

export class WaybillService {
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


import type {
  Route,
  WaybillCategory,
  WaybillItem,
  WaybillTransportableProduct,
} from '../models';
import type {
  RouteApi,
  WaybillCategoryApi,
  WaybillItemApi,
  WaybillTransportableProductApi,
} from '../models/api';

export class WaybillAdapter {
  public static toWaybillCategory(
    category: WaybillCategoryApi,
  ): WaybillCategory {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }

  public static toWaybillTransportableProduct(
    data: WaybillTransportableProductApi,
  ): WaybillTransportableProduct {
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      uom: data.uom,
    };
  }

  public static toRoute(data: RouteApi): Route {
    return {
      id: data.id,
      name: data.name,
      distance: data.distance,
      travelTime: data.travel_time,
    };
  }

  public static toWaybillItem(data: WaybillItemApi): WaybillItem {
    return {
      id: data.id,
      code: data.code,
      name: data.name,
    };
  }
}


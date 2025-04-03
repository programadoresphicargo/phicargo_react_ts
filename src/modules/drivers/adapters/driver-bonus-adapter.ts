import type { DriverBonus, DriverBonusMonth } from '../models';
import type {
  DriverBonusApi,
  DriverBonusMonthApi,
  DriverBonusUpdateApi,
} from '../models/api';

import dayjs from 'dayjs';

export class DriverBonusAdapter {
  static toDriverBonusMonth(data: DriverBonusMonthApi): DriverBonusMonth {
    const id = String(data.month) + String(data.year);

    return {
      id: Number(id),
      month: data.month,
      year: data.year,
    };
  }

  static toDriverBonus(data: DriverBonusApi): DriverBonus {
    return {
      id: data.id_bono,
      driver: data.driver,
      month: data.mes,
      year: data.anio,
      distance: data.km_recorridos,
      score: data.calificacion,
      excellence: data.excelencia,
      productivity: data.productividad,
      operation: data.operacion,
      roadSafety: data.seguridad_vial,
      vehicleCare: data.cuidado_unidad,
      performance: data.rendimiento,
      createdAt: data.fecha_creacion ? dayjs(data.fecha_creacion) : null,
    };
  }

  static toDriverBonusUpdateApi(
    driverBonus: DriverBonus,
  ): DriverBonusUpdateApi {
    const data: DriverBonusUpdateApi = {
      id_bono: driverBonus.id,
      calificacion: driverBonus.score,
      excelencia: driverBonus.excellence,
      productividad: driverBonus.productivity,
      operacion: driverBonus.operation,
      seguridad_vial: driverBonus.roadSafety,
      cuidado_unidad: driverBonus.vehicleCare,
      rendimiento: driverBonus.performance,
    };

    return data;
  }
}


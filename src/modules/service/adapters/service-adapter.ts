import { WaybillService } from '../models';
import { WaybillServiceApi } from '../models/api';
import dayjs from 'dayjs';

export class ServiceAdapter {
  static toWaybillService(data: WaybillServiceApi): WaybillService {
    return {
      id: data.id,
      name: data.name,
      dateOrder: dayjs(data.date_order),
      state: data.state,
      cfdiComplemento: data.cfdi_complemento,
      branch: data.branch,
      company: data.company,
      category: data.category,
      client: data.client,
      reference: data.x_reference,
      subclientBel: data.x_subcliente_bel,
      routeBel: data.x_ruta_bel,
      typeBel: data.x_tipo_bel,
      modeBel: data.x_modo_bel,
      measureBel: data.x_medida_bel,
      classBel: data.x_clase_bel,
      custodyBel: data.x_custodia_bel,
      type2Bel: data.x_tipo2_bel,
      referenceOwr: data.x_reference_owr,
      reference2: data.x_reference_2,
      executive: data.x_ejecutivo,
      travel: data.travel
        ? {
            id: data.travel.id,
            name: data.travel.name,
            status: data.travel.x_status_viaje,
            driver: data.travel.driver,
            vehicle: data.travel.vehicle,
          }
        : null,
      maneuvers: data.maneuvers.map((maneuver) => ({
        id: maneuver.id_maniobra,
        type: maneuver.tipo_maniobra,
        status: maneuver.estado_maniobra,
        scheduledStart: dayjs(maneuver.inicio_programado),
        activationDate: maneuver.fecha_activacion
          ? dayjs(maneuver.fecha_activacion)
          : null,
        driver: maneuver.driver,
        vehicle: maneuver.vehicle,
      })),
    };
  }
}

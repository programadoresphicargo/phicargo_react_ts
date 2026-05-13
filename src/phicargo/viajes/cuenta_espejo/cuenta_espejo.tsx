import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import templateHTML from '../cuenta_espejo/template.html?raw';

export const copiarHTML = async (travel_id: number) => {

  try {

    const response = await odooApi.get(
      `/tms_travel/${travel_id}`
    );

    const data = response.data;
    console.log(data);

    const html = templateHTML
    .replace('{{vehicle}}', data.vehicle?.name ?? '')
    .replace('{{marca}}', data.vehicle?.marca ?? '')
    .replace('{{modelo}}', data.vehicle?.model ?? '')
    .replace('{{employee}}', data.employee?.name ?? '')
    .replace('{{route}}', data.route?.name ?? '')
    .replace('{{modalidad}}', data.x_tipo_bel?.toUpperCase() ?? '')
    .replace('{{contenedores}}', data.x_references ?? '')
    .replace('{{cliente}}', data.partner?.name ?? '')
    .replace('{{origen}}', data.origen ?? '')
    .replace('{{destino}}', data.destino ?? '')
    .replace('{{client_order_ref}}', data.client_order_ref ?? '')
    .replace('{{trailer1}}', data.trailer1?.name ?? '')
    .replace('{{trailer2}}', data.trailer2?.name ?? '');

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob(
          [html],
          { type: 'text/html' }
        ),
      }),
    ]);

    toast.success('Contenido copiado');

  } catch (error) {

    console.error(error);

    toast.error(
      'Error al generar el contenido'
    );
  }
};
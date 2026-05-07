import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";

export const copiarHTML = async (travel_id: number) => {

 try {

  const response = await odooApi.get(
   `/tms_travel/${travel_id}`
  );

  const data = response.data;

  const html = `
      <div style="
        font-family: Arial;
        font-size: 14px;
      ">

        <h2 style="
          color: blue;
          margin-bottom: 10px;
        ">
          Cuenta espejo
        </h2>

        <table
          border="1"
          cellpadding="5"
          cellspacing="0"
          style="
            border-collapse: collapse;
            width: 100%;
          "
        >
          <tr
            style="
              background: #003466;
            "
          >
            <th>ECO PLACAS</th>
            <th>OPERADOR</th>
            <th>DESTINO</th>
            <th>MODALIDAD</th>
            <th>CONTENEDOR</th>
          </tr>

          <tr>
            <td>${data.vehicle.name}</td>
            <td>${data.employee.name}</td>
            <td>${data.route.name}</td>
            <td>${data.x_tipo_bel}</td>
            <td>${data.x_references}</td>
          </tr>
        </table>

        <br>

        <a href="https://telematics.tecnomotum.com/">
          Enlace Tecnomotum
        </a>

        <br><br>

        <b>Usuario:</b> 
        <br>

        <b>Contraseña:</b> 

      </div>
    `;

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
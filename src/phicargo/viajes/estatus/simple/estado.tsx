import { tiempoTranscurrido } from "@/phicargo/funciones/tiempo";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import ArchivosAdjuntos from "../archivos_adjuntos";
import BotonMapa from "../botonMapa";
import BotonDistanciaMapa from "../enlaceDistancia";
import { useAuthContext } from "@/modules/auth/hooks";
import { getBadgeClass } from "../badgeClass";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import odooApi from "@/api/odoo-api";
import toast from "react-hot-toast";
import PanelEnvio from "../../panel_envio_estatus/panel_envio";
import HistorialCambios from "@/phicargo/almacen/solicitud/cambios/epps";

export type Step = {
  nombre_estatus: string;
  tipo_registrante: string;
  ultima_fecha_envio: string;
  nombre_registrante: string;
  imagen: string;
  registros: number;
  id_reportes_agrupados: number[],
  id_reporte: number;
  latitud: number;
  longitud: number;
  localidad: string;
  sublocalidad: string;
  calle: string;
  codigo_postal: number;
  placas: string;
  fecha_hora: string;
  fecha_envio: string;
  id_reenvio: number;
  usuario_reenvio: string;
  fecha_reenvio: string;
  comentarios_estatus: string;
  name: string;
  primera_fecha_envio: string;
  mails: any[];
};

export default function EstatusDetalle({ step }: { step: Step }) {

  const { session } = useAuthContext();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  }

  const [fecha, setFecha] = useState<Dayjs | null>(
    dayjs(step.fecha_envio)
  );

  const UpdateDate = async (id_reporte: number, fecha_hora: string) => {
    if (!fecha_hora) return
    try {
      const response = await odooApi.patch('/tms_travel/reportes_estatus_viajes/actualizar_estatus_fecha/' + id_reporte + '/' + fecha_hora);
      if (response.data.status == 'success') {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    }
  };

  return (
    <>
      <PanelEnvio open={open} cerrar={() => handleClose()} id_reporte={step.id_reporte}></PanelEnvio>

      <Card className="max-w-full m-3">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              color={`${getBadgeClass(step.tipo_registrante)}`}
              isBordered
              radius="full"
              size="md"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
              <h5 className="text-small tracking-tight text-default-400">{step.nombre_registrante}</h5>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session?.user?.permissions?.includes(150) && (
              <>
                <Button
                  radius="full"
                  className="text-white"
                  color="success"
                  onPress={() => {
                    if (fecha) {
                      UpdateDate(step.id_reporte, fecha.format("YYYY-MM-DD HH:mm:ss"));
                    }
                  }}
                >
                  Guadar
                </Button>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Fecha y hora"
                    value={fecha}
                    onChange={(newValue) => {
                      setFecha(newValue);
                    }}
                  />
                </LocalizationProvider>
              </>
            )}
          </div>

        </CardHeader>

        <CardBody className="text-small text-default-500">
          <span>Referencia reporte: {step.id_reporte}</span>
          <span>Placas: {step.placas}</span>
          <span>Coordenadas: {step.latitud},{step.longitud}</span>
          <span>Localidad: {step.localidad}</span>
          <span>Sublocalidad: {step.sublocalidad}</span>
          <span>Calle: {step.calle}</span>
          <span>Codigo postal: {step.codigo_postal}</span>
          <span>Fecha GPS: {step.fecha_hora}</span>
          <span>Fecha envío: {step.fecha_envio}</span>

          < ArchivosAdjuntos id_reporte={step.id_reporte} tabla="reportes_estatus_viajes"></ArchivosAdjuntos>

        </CardBody>

        <CardFooter className="gap-3">
          <Button
            radius="full"
            color="success"
            className='text-white me-2'
            variant="solid"
            onPress={() => setOpen(true)}>
            <i className="bi bi-reply"></i>
            Reenviar
          </Button>
          <BotonMapa latitud={step.latitud} longitud={step.longitud}></BotonMapa>
          <BotonDistanciaMapa latitud={step.latitud} longitud={step.longitud}></BotonDistanciaMapa>
        </CardFooter>
      </Card>

      {step.comentarios_estatus ? (
        <Card className="max-w-full m-4">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">Añadio un comentario</h4>
                <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
              </div>
            </div>

            {tiempoTranscurrido(step.fecha_hora)}
          </CardHeader>
          <CardBody className="text-small text-default-500">
            {step.comentarios_estatus}
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className=" text-default-400 text-small">{step.fecha_envio}</p>
            </div>
          </CardFooter>
        </Card>) : (null)}

      {step.id_reenvio !== null && (
        <Card className="max-w-full m-4">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">Enviado por</h4>
                <h5 className="text-small tracking-tight text-default-400">{step.name}</h5>
              </div>
            </div>

            {tiempoTranscurrido(step.fecha_hora)}
          </CardHeader>
          <CardBody className="text-small text-default-500">
            <span className="d-block fs-5 text-dark text-truncate">Referencia reenvio: <span className="text-muted">{step.id_reenvio}</span></span>
            <span className="d-block fs-5 text-dark text-truncate">Reenviado por: <span className="text-muted">{step.usuario_reenvio}</span></span>
            <span className="d-block fs-5 text-dark">Fecha reenvio: <span className="text-muted">{tiempoTranscurrido(step.fecha_reenvio)}</span></span>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className=" text-default-400 text-small">Fecha y Hora: {tiempoTranscurrido(step.fecha_hora)}</p>
            </div>
          </CardFooter>
        </Card>
      )}

      <HistorialCambios data={step.mails}></HistorialCambios>
    </>
  );
}
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Chip, DatePicker, Input, Textarea } from '@heroui/react';
import SelectFlota from '../maniobras/selects_flota';
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { parseDate, parseDateTime, getLocalTimeZone } from "@internationalized/date";

const FormularioContenedor = ({ open, handleClose, data }) => {

  const [formData, setFormData] = useState({});
  const [isLoading, setLoading] = useState(false);

  function getLocalISOString() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19);
  }

  /**
   * Inicializar formulario cuando cambia `data`
   */
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData({
        ...data,
        id_cp: data.id, // 🔑 siempre incluir id_cp
        fecha_llegada: data.fecha_llegada ?? null,
      });
    } else {
      setFormData({});
    }
  }, [data]);

  /**
   * Detecta si es actualización
   */
  const isUpdate = Boolean(formData?.id_checklist);

  /**
   * Inputs normales
   */
  const handleChange = (name, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  /**
   * SelectFlota
   */
  const handleSelectChange = (selectedOption, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ?? null,
    }));
  };

  const update_fecha = (newValue) => {
    const date = newValue.toDate(getLocalTimeZone());

    const formatted =
      date.getFullYear() +
      '-' + String(date.getMonth() + 1).padStart(2, '0') +
      '-' + String(date.getDate()).padStart(2, '0');

    setFormData((prev) => ({
      ...prev,
      fecha_llegada: formatted,
    }));
  };
  /**
   * Guardar / Actualizar
   */
  const Save = async () => {
    try {
      setLoading(true);

      let response;

      if (isUpdate) {
        // 🔄 ACTUALIZAR
        response = await odooApi.patch(
          `/tms_waybill/control_contenedores/${formData.id_checklist}`,
          formData
        );
      } else {
        // 💾 CREAR
        response = await odooApi.post(
          '/tms_waybill/control_contenedores',
          formData
        );
      }

      if (response?.data?.status === 'success') {
        toast.success(response.data.message);
        handleClose();
      } else {
        toast.error(response?.data?.message ?? 'Error desconocido');
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ?? 'Ocurrió un error al guardar'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Información del contenedor</DialogTitle>

      <DialogContent>
        <div className="flex flex-col gap-4">

          {data?.x_reference && (
            <Chip color="success" className="text-white">
              {data.x_reference}
            </Chip>
          )}

          <h1 className="font-semibold">
            Cliente: {data?.cliente ?? '—'}
          </h1>

          <DatePicker
            label="Fecha de llegada"
            variant="bordered"
            value={
              formData.fecha_llegada
                ? parseDateTime(formData.fecha_llegada)
                : null
            }
            onChange={update_fecha}
          />

          <Input
            label="Sellos"
            variant="bordered"
            value={formData.sellos ?? ''}
            onValueChange={(value) => handleChange('sellos', value)}
          />

          <SelectFlota
            id="remolque_id"
            name="remolque_id"
            label="Remolque"
            tipo="trailer"
            value={formData.remolque_id}
            onChange={handleSelectChange}
          />

          <SelectFlota
            id="dolly_id"
            name="dolly_id"
            label="Dolly"
            tipo="dolly"
            value={formData.dolly_id}
            onChange={handleSelectChange}
          />

          <Textarea
            label="Observaciones"
            variant="bordered"
            value={formData.observaciones ?? ''}
            onValueChange={(value) => handleChange('observaciones', value)}
          />

        </div>
      </DialogContent>

      <DialogActions>
        <Button onPress={handleClose} radius="full">
          Cancelar
        </Button>

        <Button
          color={isUpdate ? 'success' : 'primary'}
          radius="full"
          onPress={Save}
          isLoading={isLoading}
          className="text-white"
        >
          {isUpdate ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioContenedor;

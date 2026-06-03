import { Button, Card, CardBody, CardHeader, Divider, } from '@heroui/react';
import { useEffect, useState } from 'react';
import { DatePicker } from "@heroui/date-picker";
import odooApi from '@/api/odoo-api';
import AsignacionCelular from './asignacion_celular';
import toast from 'react-hot-toast';
import AsignacionComputo from './asignacion_computo';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Grid } from '@mui/material';
import { AutocompleteInput } from '@/components/inputs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { SelectItem } from '@/types';
import { Celular } from '../celulares/schema';
import { EquipoComputo } from '../equipo_computo/form';
import { parseDate } from '@internationalized/date';

type Data = {
  id_empleado: number,
  fecha_asignacion: Dayjs,
}

export type AsignacionActivo = {
  data: Data,
  celulares: Celular[];
  equipo_computo: EquipoComputo[];
}

type Empleado = {
  id_empleado: number,
  nombre_empleado: string;
}

const initialForm: AsignacionActivo = {
  data: {
    id_empleado: 0,
    fecha_asignacion: dayjs(),
  },
  celulares: [],
  equipo_computo: [],
};

export default function ModalAsignacion({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {

  const { control, handleSubmit, reset } = useForm<AsignacionActivo>({
    defaultValues: initialForm,
  });

  const {
    fields: celularesFields,
    append: appendCelular,
    remove: removeCelular,
    update: updateCelular
  } = useFieldArray({
    control,
    name: "celulares",
  });

  const {
    fields: equiposFields,
    append: appendEquipo,
    remove: removeEquipo,
  } = useFieldArray({
    control,
    name: "equipo_computo",
  });

  const [isLoading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<SelectItem[]>([]);
  const [isLoadingEmpleados, setLoadingEmpleados] = useState(false);

  const fetchData = async () => {
    try {
      setLoadingEmpleados(true);
      const response = await odooApi.get<Empleado[]>("/inventarioti/empleados/activo/true");
      setEmpleados(
        response.data.map((empleado) => ({
          key: empleado.id_empleado,
          value: empleado.nombre_empleado,
        }))
      );
      setLoadingEmpleados(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Create = async (data: AsignacionActivo) => {

    const sinLinea = (data.celulares || []).some(cel => !cel.id_linea);

    if (sinLinea) {
      toast.error("Todos los celulares deben tener asignada una línea.");
      return;
    }

    if (!data?.data.id_empleado) {
      toast.error('Ingresa el nombre del empleado');
      return;
    }

    if (
      (!data.celulares || data.celulares.length === 0) &&
      (!data.equipo_computo || data.equipo_computo.length === 0)
    ) {
      toast.error("Debes registrar al menos un celular o un equipo de computo");
      return;
    }

    try {
      setLoading(true);
      const response = await odooApi.post("/inventarioti/asignaciones/", data);
      if (response.data.status == 'success') {
        toast.success(response.data.message);
        reset(initialForm);
        onOpenChange();
      }
      setLoading(false);
    } catch (error: any) {
      toast.error('Error al obtener los datos:' + error.detail);
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className="flex items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                color: 'white',
                fontWeight: 'bold'
              }}>
              <h1
                className="tracking-tight font-semibold lg:text-2xl"
              >
                Asignación de activos
              </h1>
              <Button color='success' onPress={() => handleSubmit(Create)()} className='text-white' isLoading={isLoading} radius='full'>Guardar asignación</Button>
            </ModalHeader>
            <ModalBody>

              <Grid container spacing={2} className='pt-5'>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardHeader style={{
                      background: 'linear-gradient(90deg, #a10003, #002887)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      Información del empleado
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                      <div className="w-full grid grid-cols-1 gap-4">
                        <AutocompleteInput
                          control={control}
                          label="Empleado"
                          name="data.id_empleado"
                          isLoading={isLoadingEmpleados}
                          variant='bordered'
                          items={empleados}
                          rules={{ required: "Campo obligatorio" }}
                        />
                        <Controller
                          control={control}
                          name="data.fecha_asignacion"
                          render={({ field, fieldState }) => {
                            const calendarValue =
                              field.value
                                ? parseDate(field.value.format("YYYY-MM-DD"))
                                : null;

                            return (
                              <DatePicker
                                label="Fecha de asignacion"
                                variant="bordered"
                                value={calendarValue}
                                onChange={(val) => {
                                  field.onChange(val ? dayjs(val.toString()) : null);
                                }}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                              />
                            );
                          }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Grid>

                <Grid item xs={12} md={9}>
                  <AsignacionCelular
                    celularesFields={celularesFields}
                    appendCelular={appendCelular}
                    removeCelular={removeCelular}
                    update={updateCelular}
                  />
                  <AsignacionComputo
                    equiposFields={equiposFields}
                    appendEquipo={appendEquipo}
                    removeEquipo={removeEquipo}
                  />
                </Grid>
              </Grid>

            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal >
  );
};


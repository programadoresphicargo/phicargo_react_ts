import { Button, Card, CardBody, CardHeader, Chip, Divider, Select, SelectItem } from '@heroui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from "@heroui/date-picker";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import AsignacionCelular from './asignacion_celular';
import { InventarioProvider, useInventarioTI } from '../../contexto/contexto';
import { now, getLocalTimeZone, today } from "@internationalized/date";
import { parseDate, parseDateTime } from "@internationalized/date";
import toast from 'react-hot-toast';
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import AsignacionComputo from './asignacion_computo';

const AsignacionActivosForm = () => {

  const { form_data, setFormData } = useInventarioTI();
  const [isLoading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [isLoadingEmpleados, setLoadingEmpleados] = useState([]);

  const fetchData = async () => {
    try {
      setLoadingEmpleados(true);
      const response = await odooApi.get("/inventarioti/empleados/activo/true");
      setEmpleados(response.data);
      setLoadingEmpleados(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Create = async () => {
    console.log(form_data.celulares.length);
    const sinLinea = (form_data.celulares || []).some(cel => !cel.id_linea);

    if (sinLinea) {
      toast.error("Todos los celulares deben tener asignada una línea.");
      return; // detener el envío
    }


    if (!form_data?.data?.id_empleado) {
      console.log(form_data);
      toast.error('Ingresa el nombre del empleado');
      return;
    }

    if (
      (!form_data.celulares || form_data.celulares.length === 0) &&
      (!form_data.equipo_computo || form_data.equipo_computo.length === 0)
    ) {
      toast.error("Debes registrar al menos un celular o un equipo de computo");
      return;
    }

    try {
      setLoading(true);
      const response = await odooApi.post("/inventarioti/asignaciones/", form_data);
      if (response.data.status == 'success') {
        toast.success(response.data.message);
        setFormData({ data: [], celulares: [], equipo_computo: [] });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...(prev.data || {}),
        [field]: value
      }
    }));
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex items-center justify-between gap-4"
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
          <Button color='success' onPress={() => Create()} className='text-white' isLoading={isLoading}>Guardar asignación</Button>
        </CardHeader>
        <Divider></Divider>
        <CardBody>
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
              <div className="w-full grid grid-cols-2 gap-4">
                <Autocomplete
                  isLoading={isLoadingEmpleados}
                  label="Empleado"
                  variant='bordered'
                  onSelectionChange={(keys) => handleChange("id_empleado", Number([...keys][0]))}
                  isInvalid={!form_data?.data?.id_empleado}
                  errorMessage={!form_data?.data?.id_empleado ? "El empleado es obligatorio" : ""}>
                  {empleados.map((animal) => (
                    <AutocompleteItem key={animal.id_empleado}>{animal.id_empleado + ' - ' + animal.nombre_empleado}</AutocompleteItem>
                  ))}
                </Autocomplete>
                <DatePicker
                  variant='bordered'
                  label="Fecha de asignación"
                  value={
                    form_data?.data?.fecha_asignacion
                      ? parseDate(form_data?.data?.fecha_asignacion)
                      : today(getLocalTimeZone())
                  }
                  onChange={(date) => {
                    if (!date) {
                      handleChange("fecha_asignacion", null);
                      return;
                    }
                    const d = new Date(date);
                    const formattedDate = d.toISOString().slice(0, 10);
                    handleChange("fecha_asignacion", formattedDate);
                  }}
                />
              </div>
            </CardBody>
          </Card>
          <AsignacionCelular></AsignacionCelular>
          <AsignacionComputo></AsignacionComputo>
        </CardBody>
      </Card>
    </div >
  );
};

export default AsignacionActivosForm;


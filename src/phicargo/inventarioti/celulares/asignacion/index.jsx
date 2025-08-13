import { Button, Card, CardBody, CardHeader, Chip, Divider, Select, SelectItem } from '@heroui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import AsignacionCelular from './asignacion_celular';
import { InventarioProvider } from '../../contexto/contexto';

const AsignacionActivos = () => {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get("/inventarioti/empleados/estado/ACTIVO/");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <InventarioProvider>
        <NavbarInventarioTI></NavbarInventarioTI>
        <Card>
          <CardHeader>
            Asignación de activos
            <Button color='primary'>Guardar asignación</Button>
          </CardHeader>
          <Divider></Divider>
          <CardBody>
            <Card>
              <CardHeader>
                Información del empleado
              </CardHeader>
              <Divider></Divider>
              <CardBody>
                <Select className="max-w-xs" label="Empleado">
                  {data.map((animal) => (
                    <SelectItem key={animal.key}>{animal.nombre_empleado + ' ' + animal.apellido_materno}</SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>
            <AsignacionCelular></AsignacionCelular>
          </CardBody>
        </Card>
      </InventarioProvider>
    </div>
  );
};

export default AsignacionActivos;


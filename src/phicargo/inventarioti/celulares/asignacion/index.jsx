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
import AsignacionActivosForm from './form';

const AsignacionActivos = () => {

  return (
    <div>
      <InventarioProvider>
        <NavbarInventarioTI></NavbarInventarioTI>
        <AsignacionActivosForm></AsignacionActivosForm>
      </InventarioProvider >
    </div >
  );
};

export default AsignacionActivos;


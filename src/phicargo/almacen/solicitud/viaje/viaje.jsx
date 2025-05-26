import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Input, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box, Stack } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EPP from '../../epp/epp';
import { useAlmacen } from '../../contexto/contexto';

const ViajeEPP = ({ }) => {

  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/get_by_id/74566');
      setData(response.data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>

      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Input label="Viaje" value={data?.name} variant='underlined' size='sm' disabled={false}></Input>
          <Input label="Operador" value={data?.employee?.name ?? ''} variant='underlined' size='sm' disabled={false}></Input>
          <Input label="Vehiculo" value={data?.vehicle?.name ?? ''} variant='underlined' size='sm' disabled={false}></Input>
        </div>
      </div>

    </>
  );
};

export default ViajeEPP;

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Divider, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
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
import EPP from '../../inventario/tabla_productos';
import { useAlmacen } from '../../contexto/contexto';

const HistorialCambios = ({ cambios }) => {

  return (
    <>
      <div>
        {cambios.map((cambio, index) => (
          <>
            <p key={index} className='mb-5'>
              <Chip color='primary' size='sm'>{new Date(cambio.create_date).toLocaleString()}</Chip>
              {` ${cambio.body} ${cambio.usuario} cambió ${cambio.field_desc} de "${cambio.old_value_char}" a "${cambio.new_value_char}"`}
            </p>
          </>
        ))}
      </div>
    </>
  );
};

export default HistorialCambios;

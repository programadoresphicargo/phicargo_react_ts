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
      <div className="space-y-4">
        {cambios.map((cambio, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Fecha */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                {new Date(cambio.create_date).toLocaleString()}
              </span>

              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {cambio.usuario}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-700 mb-2">
              {cambio.body}
            </p>

            {/* Cambio */}
            <div className="text-sm">
              <span className="font-medium text-gray-600">
                {cambio.field_desc}
              </span>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                  {cambio.old_value_char || "—"}
                </span>

                <span className="text-gray-400">→</span>

                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                  {cambio.new_value_char || "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HistorialCambios;

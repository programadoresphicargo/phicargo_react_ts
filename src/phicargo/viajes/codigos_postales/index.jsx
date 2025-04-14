import { Button, Link } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import NavbarViajes from "../navbar";
import { ViajeProvider } from "../context/viajeContext";
import CodigosPostales from "./tabla";

const CodigosPostalesIndex = ({ }) => {

  return (
    <>
      <ViajeProvider>
        <NavbarViajes></NavbarViajes>
        <CodigosPostales></CodigosPostales>
      </ViajeProvider>
    </>
  );
};

export default CodigosPostalesIndex;

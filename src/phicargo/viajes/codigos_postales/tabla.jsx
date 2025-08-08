import { Button, Input, Link, NumberInput } from "@heroui/react";
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
import NavbarViajes from "../navbar";
import Slide from '@mui/material/Slide';
import { toast } from 'react-toastify';
import odooApi from "@/api/odoo-api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const CodigosPostales = ({ }) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [codigoPostal, setCodigoPostal] = useState(0);
  const [coordenadas, setCoordenadas] = useState('');

  const handleSubmit = async () => {

    if (codigoPostal == 0 || coordenadas == '') {
      toast.error('Completar la información del formulario.');
    }

    const data = {
      codigo: codigoPostal,
      coordenadas: coordenadas,
    };

    try {
      const response = await odooApi.post('/tms_travel/codigos_postales/', data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        fetchData();
        setCodigoPostal('');
        setCoordenadas('');
        onOpenChange();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }

  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/codigos_postales/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Codigo',
      },
      {
        accessorKey: 'latitud',
        header: 'Latitud',
      },
      {
        accessorKey: 'longitud',
        header: 'Longitud',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button color="primary" onPress={onOpen}>Nuevo</Button>
      </Box >
    )
  });

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Nuevo código postal</ModalHeader>
              <ModalBody>
                <NumberInput
                  placeholder="Código postal"
                  variant="bordered"
                  value={codigoPostal}
                  onValueChange={(value) => setCodigoPostal(value)}
                  max={99999}
                  min={10000}
                />
                <Input
                  variant="bordered"
                  label="Coordenadas"
                  value={coordenadas}
                  onChange={(e) => setCoordenadas(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={() => handleSubmit()}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <MaterialReactTable table={table} />
    </>
  );
};

export default CodigosPostales;

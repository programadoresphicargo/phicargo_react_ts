import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@heroui/react";

import { Button } from "@heroui/react";
import { Chip } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioCorreoGeneral from '@/phicargo/correos_electronicos/correoForm';
import { Input } from "@heroui/react";
import { User } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const CorreosElectronicosViaje = ({ openCorreos }) => {

  const { id_viaje, viaje, comprobacion_correos } = useContext(ViajeContext);
  const [correosCliente, setCorreosCliente] = useState([]);
  const [correosLigados, setCorreosLigados] = useState([]);
  const [isLoading2, setLoading] = useState(false);
  const [isLoadingCM, setLoadingCM] = useState(false);

  const getCorreosCliente = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/correos/get_by_id_cliente/' + viaje?.partner?.id);
      setCorreosCliente(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getCorreosLigados = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/correos/id_viaje/' + id_viaje);
      setCorreosLigados(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreo = async (id_correo) => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/tms_travel/correos/enlazar/${id_viaje}/${id_correo}`);
      if (response.data.status == "success") {
        toast.success(response.data.message);
        getCorreosLigados();
        comprobacion_correos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreoManiobras = async (id_correo) => {
    try {
      setLoadingCM(true);
      const response = await odooApi.get(`/maniobras/correos/ligar_correos_maniobra/${id_viaje}`);
      getCorreosLigados();
      comprobacion_correos();
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoadingCM(false);
    }
  };

  const desvincularCorreo = async (id_correo) => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/correos/desvincular/' + id_correo);
      getCorreosLigados();
      comprobacion_correos();
    } catch (error) {
      console.error('Error en desvincularCorreo', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCorreosCliente();
    getCorreosLigados();
  }, [openCorreos]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = correosLigados.filter((visitor) =>
    visitor.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    getCorreosCliente();
    getCorreosLigados();
    setOpen(false);
  };

  return (<>
    <div>
      <Button color="success" className="text-white mb-3" onPress={() => enlazarCorreoManiobras()} isLoading={isLoadingCM}>Ligar correos de maniobras</Button>
      <Autocomplete
        fullWidth="true"
        defaultItems={correosCliente}
        variant="bordered"
        label="Correos electronicos del cliente"
        placeholder="Selecciona un correo electronico"
        labelPlacement="inside"
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
      >
        {(correosCliente) => (
          <AutocompleteItem key={correosCliente.id_correo} textValue={correosCliente.correo}>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar alt={correosCliente.correo} className="flex-shrink-0" size="sm" src={""} />
                <div className="flex flex-col">
                  <span className="text-small">{correosCliente.correo}</span>
                  <span className="text-tiny text-default-400">{correosCliente.tipo}</span>
                </div>
              </div>
              <Button
                onPress={() => enlazarCorreo(correosCliente.id_correo)}
                color='primary'
                size="sm"
              >
                Ligar
              </Button>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>

      <div className="flex flex-col gap-4 mb-5 mt-5">
        <div className="flex justify-between gap-3 items-end">

          <Input
            isClearable
            variant='bordered'
            className="w-full sm:max-w-[100%]"
            placeholder="Buscar..."
            value={searchTerm}
            onClear={() => setSearchTerm('')}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-3">
            <Button color="primary" onClick={handleClickOpen}>
              Nuevo correo electrónico +
            </Button>
          </div>
        </div>
      </div>

      <Table aria-label="Example static collection table" isStriped>
        <TableHeader>
          <TableColumn>Correo electronico</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredData.map((visitor, index) => (
            <TableRow key={index}>
              <TableCell>
                <User
                  avatarProps={{ radius: "full", size: "sm", src: "https://cdn-icons-png.flaticon.com/512/5611/5611946.png" }}
                  classNames={{
                    description: "text-default-500",
                  }}
                  description={visitor.nombre}
                  name={visitor.correo}
                >
                  {visitor.tipo}
                </User>
              </TableCell>
              <TableCell>
                <Chip
                  color={visitor.tipo === 'Destinatario' ? 'primary' : 'success'}
                  variant="dot"
                >
                  {visitor.tipo}
                </Chip>
              </TableCell>
              <TableCell>
                <Button color='danger' size='sm' onPress={() => desvincularCorreo(visitor.id)}>
                  <i class="bi bi-x-circle"></i>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth="sm"
      maxWidth="sm"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '18px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle>Registro de correo electronico</DialogTitle>
      <DialogContent>

        <FormularioCorreoGeneral
          handleClose={handleClose}
          idCliente={viaje?.partner?.id}>
        </FormularioCorreoGeneral>

      </DialogContent>
    </Dialog>
  </>
  );

};

export default CorreosElectronicosViaje;

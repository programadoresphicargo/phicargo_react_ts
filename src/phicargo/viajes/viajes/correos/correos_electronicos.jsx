import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioCorreo from './formulario';
import { ViajeContext } from '../context/viajeContext';
import { Autocomplete, AutocompleteItem, Avatar } from "@nextui-org/react";

const CorreosElectronicosViaje = ({ openCorreos }) => {

  const { id_viaje, viaje, comprobacion_correos } = useContext(ViajeContext);
  const [correosCliente, setCorreosCliente] = useState([]);
  const [correosLigados, setCorreosLigados] = useState([]);
  const [isLoading2, setLoading] = useState();

  const getCorreosCliente = async () => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/correos_electronicos/getCorreosCliente.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id_cliente: viaje.id_cliente }),
      });
      const jsonData = await response.json();
      setCorreosCliente(jsonData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorreosLigados = async () => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/correos_electronicos/getCorreosLigados.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id_viaje }),
      });
      const jsonData = await response.json();
      setCorreosLigados(jsonData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreo = async (id_correo) => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/correos_electronicos/ligarCorreo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id_viaje: id_viaje,
          id_correo: id_correo
        }),
      });
      getCorreosLigados();
      comprobacion_correos();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const desvincularCorreo = async (id) => {
    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/correos_electronicos/desvincularCorreo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: id
        }),
      });
      getCorreosLigados();
      comprobacion_correos();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
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
    visitor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    getCorreosLigados();
    setOpen(false);
  };

  return (<>
    <div>
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
                onClick={() => enlazarCorreo(correosCliente.id_correo)}
                className="border-small mr-0.5 font-medium shadow-small"
                radius="full"
                color='primary'
                size="sm"
                variant="bordered"
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
                  avatarProps={{ radius: "full", size: "sm", src: visitor.tipo }}
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
                <Button color='danger' size='sm' onClick={() => desvincularCorreo(visitor.id)}>
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
        <FormularioCorreo handleClose={handleClose}></FormularioCorreo>
      </DialogContent>
    </Dialog>
  </>
  );

};

export default CorreosElectronicosViaje;

import { Autocomplete, AutocompleteItem, Avatar, Card, CardHeader, Progress } from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@heroui/react";
import FormularioCorreoGeneral from '@/phicargo/correos_electronicos/form';
import { Input } from "@heroui/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export type CorreoCliente = {
  id_correo: number;
  nombre_completo: string;
  id_cliente: number | null;
  correo: string;
  tipo: string;
  activo: boolean;
};

type CorreoLigado = {
  id: number;
  id_correo: number;
  correo: string;
  tipo: string;
  nombre_completo: string;
};

type CorreosElectronicosViajeProps = {
  openCorreos: boolean;
  handleCloseCorreos: () => void;
};

const CorreosElectronicosViaje: React.FC<CorreosElectronicosViajeProps> = ({
  openCorreos,
  handleCloseCorreos
}) => {

  const { id_viaje, viaje, comprobacion_correos } = useContext(ViajeContext);
  const [correosCliente, setCorreosCliente] = useState<CorreoCliente[]>([]);
  const [correosLigados, setCorreosLigados] = useState<CorreoLigado[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingCM, setLoadingCM] = useState(false);

  const getCorreosCliente = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/correos/id_cliente/' + viaje?.partner?.id);
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

  const enlazarCorreo = async (id_correo: number) => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/tms_travel/correos/enlazar/`, {
        params: {
          id_viaje: id_viaje as number,
          id_correo: id_correo
        }
      });
      if (response.data.status == "success") {
        toast.success(response.data.message);
        getCorreosLigados();
        comprobacion_correos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        (error.response?.data?.detail || 'Error desconocido')
      );
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreoManiobras = async () => {
    try {
      setLoadingCM(true);
      await odooApi.get(`/maniobras/correos/ligar_correos_maniobra/${id_viaje}`);
      getCorreosLigados();
      comprobacion_correos();
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoadingCM(false);
    }
  };

  const desvincularCorreo = async (id: number) => {
    try {
      setLoading(true);
      const response = await odooApi.delete('/tms_travel/correos/desvincular/' + id);
      if (response.data.status == "success") {
        toast.success(response.data.message);
      }
      getCorreosLigados();
      comprobacion_correos();
    } catch (error: any) {
      toast.error(error);
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

  return (
    <>
      <Dialog
        open={openCorreos}
        onClose={handleCloseCorreos}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
            color: "white",
            fontFamily: "Inter",
          }}>
          Correos electrónicos
        </DialogTitle>

        <DialogContent dividers>
          <Button
            color="success"
            className="text-white mb-3"
            radius="full"
            onPress={() => enlazarCorreoManiobras()}
            isLoading={isLoadingCM}>
            Ligar correos de maniobras
          </Button>
          {isLoading && (
            <Progress isIndeterminate size="sm"></Progress>
          )}
          <Autocomplete
            fullWidth
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
                    <Avatar alt={correosCliente.correo} className="flex-shrink-0" size="sm" src={""} color="primary" />
                    <div className="flex flex-col">
                      <span className="text-small">{correosCliente.correo}</span>
                      <span className="text-tiny text-default-400">{correosCliente.tipo}</span>
                    </div>
                  </div>
                  <Button
                    onPress={() => enlazarCorreo(correosCliente.id_correo)}
                    color='primary'
                    size="sm"
                    radius="full"
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
                <Button color="primary" onPress={() => handleClickOpen()} radius="full">
                  Nuevo correo electrónico +
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1>Correos ligados</h1>
            {filteredData.map((visitor, index) => (
              <Card key={index} shadow="sm">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      color="primary"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">{visitor.nombre_completo}</h4>
                      <h5 className="text-small tracking-tight text-default-400">{visitor.correo}</h5>
                    </div>
                  </div>
                  <Button
                    color="danger"
                    radius="full"
                    size="sm"
                    onPress={() => desvincularCorreo(visitor.id)}
                  >
                    <i className="bi bi-x-circle"></i>Desvincular
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onPress={handleCloseCorreos} color="primary" radius="full" size="sm">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog >

      <FormularioCorreoGeneral
        open={open}
        handleClose={handleClose}
        id_cliente={viaje?.partner?.id} />
    </>
  );

};

export default CorreosElectronicosViaje;

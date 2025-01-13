import React, { useState, useContext } from 'react';
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const FormularioCorreo = ({ handleClose }) => {
  const { viaje } = useContext(ViajeContext);

  const [isLoading, setLoading] = useState(false);

  const [nombreContacto, setNombreContacto] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [tipoCorreo, setTipoCorreo] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    if (!/^[A-Za-z\s]+$/.test(nombreContacto)) {
      formErrors.nombreContacto = "El nombre solo debe contener letras y espacios.";
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correoElectronico)) {
      formErrors.correoElectronico = "El correo electrónico no tiene un formato válido.";
    }

    if (!tipoCorreo) {
      formErrors.tipoCorreo = "Debe seleccionar un tipo de correo.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const crear_correo = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await odooApi.post('/correos/crear_correo/', {
          id_cliente: viaje.id_cliente,
          nombre_completo: nombreContacto,
          correo: correoElectronico,
          tipo: tipoCorreo,
        });

        if (response.status === 200 || response.status === 201) {
          if (response.data.status === "success") {
            toast.success(response.data.message);
            handleClose();
          } else {
            toast.error('Error: ' + response.data.message);
          }
        } else {
          toast.error("Error inesperado del servidor. Por favor, intente nuevamente.");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error al conectar con el servidor: " + error.message);
        }
      }
    } else {
      setLoading(false);
      toast.error("Hay errores en el formulario. Por favor, corrígelos antes de enviar.");
    }
  };

  return (
    <form onSubmit={crear_correo}>
      <div className="w-full flex flex-col gap-4">
        <Input
          id="nombre_contacto"
          isClearable
          size='lg'
          variant='bordered'
          className="w-full sm:max-w-[100%]"
          placeholder="Nombre de la persona"
          value={nombreContacto}
          onChange={(e) => setNombreContacto(e.target.value)}
          isInvalid={errors.nombreContacto ? true : false}
          errorMessage={errors.nombreContacto}
          color={errors.nombreContacto ? 'error' : 'default'}
        />
        <Input
          id="correo_electronico"
          isClearable
          size='lg'
          variant='bordered'
          placeholder="Correo electrónico"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          isInvalid={errors.correoElectronico ? true : false}
          errorMessage={errors.correoElectronico}
          color={errors.correoElectronico ? 'error' : 'default'}
        />
        <Select
          id="tipo_correo"
          size='lg'
          label="Tipo de correo"
          variant='bordered'
          placeholder="Selecciona una opción"
          className="w-full sm:max-w-[100%]"
          selectedKeys={tipoCorreo ? [tipoCorreo] : []}
          onSelectionChange={(keys) => setTipoCorreo([...keys][0])} // Convert Set to string
          color={errors.tipoCorreo ? 'error' : 'default'}
          isInvalid={errors.tipoCorreo ? true : false}
          errorMessage={errors.tipoCorreo}
        >
          <SelectItem key="Destinatario">Destinatario</SelectItem>
          <SelectItem key="CC">CC</SelectItem>
        </Select>

        <Button color='primary' onPress={() => crear_correo()} isLoading={isLoading}>Registrar</Button>
      </div>
    </form>
  );
};

export default FormularioCorreo;

import React, { useState, useContext } from 'react';
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { ViajeContext } from '../context/viajeContext';
const { VITE_PHIDES_API_URL } = import.meta.env;

const FormCorreo = ({ handleClose }) => {
  const { viaje } = useContext(ViajeContext);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch(VITE_PHIDES_API_URL + '/correos/consultas/ingresar_correo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id_cliente: viaje.id_cliente,
          nombre_contacto: nombreContacto,
          correo_electronico: correoElectronico,
          tipo_correo: tipoCorreo,
        }),
      })
        .then(response => response.json())
        .then(data => {
          toast.success("Formulario enviado exitosamente");
          handleClose();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      toast.error("Hay errores en el formulario. Por favor, corrígelos antes de enviar.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

        <Button color='primary' type="submit">Registrar</Button>
      </div>
    </form>
  );
};

export default FormCorreo;

import { Button, select } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Select, SelectItem, Textarea } from "@heroui/react";
import { Upload, message } from 'antd';

import { Box } from '@mui/material';
import { Input } from "@heroui/react";
import Slide from '@mui/material/Slide';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const FormularioNewCE = ({ onClose, id_tipo_costo }) => {

  const [Loading, setLoading] = useState(false);

  const registrar = async () => {
    console.log("Datos enviados:", formData);
    setLoading(true);

    try {
      const response = await odooApi.post('/tipos_costos_extras/create/', formData);
      const data = response.data;
      setLoading(false);
      if (data.status == "success") {
        message.success(data.message);
        setFormData({
          id_tipo_costo: null,
          descripcion: '',
          costo: 0,
          unidad_medida: '',
          observaciones: ''
        });
        onClose();
      } else {
        message.error(`Error: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      message.error('Error en la solicitud');
    }
  };

  const actualizar = async () => {
    console.log("Datos enviados:", formData);
    setLoading(true);

    try {
      const response = await odooApi.post('/tipos_costos_extras/update/', formData);
      const data = response.data;
      setLoading(false);
      if (data.status == "success") {
        message.success(data.message);
        id_tipo_costo = null
        onClose();
      } else {
        message.error(`Error: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      message.error('Error en la solicitud');
    }
  };

  const [formData, setFormData] = useState({
    descripcion: '',
    costo: 0.0,
    unidad_medida: null,
    observaciones: null
  })

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (id_tipo_costo != null) {
      odooApi.get(`/tipos_costos_extras/by_id_tipo_costo/${id_tipo_costo}`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            const data = response.data[0];
            setFormData(prevState => ({
              ...prevState,
              id_tipo_costo: data.id_tipo_costo || '',
              descripcion: data.descripcion || '',
              costo: data.costo || 0.0,
              unidad_medida: data.unidad_medida || '',
              observaciones: data.observaciones || ''
            }));
          } else {
            console.warn('No se encontraron datos para id_tipo_costo:', id_tipo_costo);
            setFormData({
              id_tipo_costo: '',
              descripcion: '',
              costo: 0,
              unidad_medida: '',
              observaciones: ''
            });
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
          toast.error(`Error al obtener datos de maniobra: ${error.response?.data?.message || error.message}`);
        });
    } else {
      setFormData({
        descripcion: '',
        costo: 0,
        unidad_medida: '',
        observaciones: ''
      });
    }
  }, [id_tipo_costo]);

  const animals = [
    { key: "pieza", label: "Pieza" },
    { key: "contenedor", label: "Contenedor" },
    { key: "operador", label: "Operador" },
    { key: "plataforma", label: "Plataforma" },
    { key: "na", label: "No aplica" },
  ];

  return (
    <>

      {id_tipo_costo == null && (
        <Button
          isLoading={Loading}
          color="primary"
          onPress={registrar}
        >
          Registrar
        </Button>
      )}

      {id_tipo_costo != null && (
        <Button
          className='text-white'
          isLoading={Loading}
          color="success"
          onPress={actualizar}
        >
          Actualizar
        </Button>
      )}

      <div className="flex w-full flex-wrap md:flex-nowrap gap-2 mt-3">
        <Input
          label="Descripción"
          type="text"
          name="descripcion"
          variant="bordered"
          value={formData.descripcion}
          onValueChange={(value) => handleChange("descripcion", value)} />
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap gap-2 mt-3">
        <Input
          label="Costo preestablecido"
          type="number"
          value={formData.costo}
          name="costo"
          variant="bordered"
          onValueChange={(value) => handleChange("costo", value)} />
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap gap-2 mt-3">
        <Select
          label="Unidad medida"
          fullWidth={true}
          placeholder="Seleccionar unidad de medida"
          selectedKeys={[formData.unidad_medida]}
          variant="bordered"
          onSelectionChange={(value) => handleChange("unidad_medida", value.currentKey)}
        >
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap gap-2 mt-3">
        <Textarea
          label="Observaciones"
          placeholder="Ingresa las observaciones"
          value={formData.observaciones}
          variant="bordered"
          onValueChange={(value) => handleChange("observaciones", value)}
        />
      </div >
    </>
  );
};

export default FormularioNewCE;

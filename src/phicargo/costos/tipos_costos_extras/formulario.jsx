import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { Button, select } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import Slide from '@mui/material/Slide';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { Input } from "@nextui-org/react";
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
    costo: 0.0
  })

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (id_tipo_costo) {
      odooApi.get(`/tipos_costos_extras/by_id_tipo_costo/${id_tipo_costo}`)
        .then((response) => {
          if (response.data.length > 0) {
            const data = response.data[0];
            setFormData({
              id_tipo_costo: data.id_tipo_costo,
              descripcion: data.descripcion || '',
              costo: data.costo || 0.0,
            });
          } else {
            console.warn('No se encontraron datos para id_tipo_costo:', id_tipo_costo);
            setFormData({});
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
          toast.error(`Error al obtener datos de maniobra: ${error.response?.data?.message || error.message}`);
        });
    } else {
      setFormData({
        id_tipo_costo: null,
        descripcion: '',
        costo: 0,
      });
    }
  }, [id_tipo_costo]);

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
          value={formData.descripcion}
          onValueChange={(value) => handleChange("descripcion", value)} />

        <Input
          label="Costo preestablecido"
          type="number"
          value={formData.costo}
          name="costo"
          onValueChange={(value) => handleChange("costo", value)} />
      </div>
    </>
  );
};

export default FormularioNewCE;

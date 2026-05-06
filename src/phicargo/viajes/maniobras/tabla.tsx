import { Button, Chip } from "@heroui/react";
import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { User } from "@heroui/react";
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { Checkbox } from "@heroui/react";
import EstatusDropdownManiobra from "@/phicargo/maniobras/reportes_estatus/resumen_estatus";
import Formulariomaniobra from "@/phicargo/maniobras/maniobras/formulario_maniobra";
import { ViajeContext } from "../context/viajeContext";
import { toast } from "react-toastify";

type Params = {
  travel_id: string;
};

type Maniobra = {
  id_maniobra: number;
  tipo_maniobra: string;
  fecha_registro: string;
  usuario_ultimo_estatus: string;
  fecha_ultimo_estatus: string;
};

type ManiobrasProps = {
};

const Maniobras: React.FC<ManiobrasProps> = ({
}) => {

  const { id_viaje } = useContext(ViajeContext);

  const tipo_maniobra = [
    { tipo: 'retiro', label: "Retiro" },
    { tipo: 'ingreso', label: "Ingreso" },
  ];

  const [filteredData, setFilteredData] = useState<Maniobra[]>([]);
  const [selectedManiobras, setSelectedManiobras] = useState<string[]>([]);
  const [data, setData] = useState<Maniobra[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [id_maniobra, setIDManiobra] = useState<number | null>(null);
  const [dataCP, setDataCP] = useState({});

  const handleShowModal = (id_maniobra: number, data: Maniobra) => {
    setModalShow(true);
    setIDManiobra(id_maniobra);
    setDataCP(data);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const params: Params = {
        travel_id: id_viaje,
      };

      setLoading(true);
      const response = await odooApi.get('/maniobras/estado/', { params });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  const crearAuto = async () => {
    try {
      setLoading(true);
      const response = await odooApi.post('/maniobras/create_auto/' + id_viaje);
      toast.success(response.data.message);
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedManiobras.length === 0) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(item =>
          selectedManiobras.includes(item.tipo_maniobra)
        )
      );
    }
  }, [data, selectedManiobras]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_maniobra',
        header: 'ID Maniobra',
        size: 50,
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
        size: 150,
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const date = cell.getValue<string>();
          return date;
        },
      },
      {
        accessorKey: 'terminal',
        header: 'Terminal',
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const value = cell.getValue<string>();
          if (!value) return;
          return (
            <Chip color='primary' size="sm">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre_operador',
        header: 'Operador',
        size: 150,
      },
      {
        accessorKey: 'tipo_empleado',
        header: 'Tipo',
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const value = cell.getValue<string>();
          if (!value) return;

          return (
            <Chip color={
              value === "MOVEDOR" ? "success" :
                value === "OPERADOR" ? "primary" :
                  value === "OPERADOR POSTURERO"
                    ? "danger" : "default"} size="sm"
              className="text-white capitalize">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo_maniobra',
        header: 'Tipo de maniobra',
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const value = cell.getValue<string>();

          return (
            <Chip color={
              value === 'retiro'
                ? 'success'
                : value === 'ingreso'
                  ? 'primary'
                  : value === 'local'
                    ? 'danger'
                    : 'secondary'} className="text-white" size="sm">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'modo',
        header: 'Modo',
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const modo = String(cell.getValue() || '');

          return (
            <Chip color={modo == "imp" ? "warning" : "danger"} className="text-white" size="sm">
              {modo.charAt(0).toUpperCase() + modo.slice(1)}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'contenedores_ids',
        header: 'Contenedor',
      },
      {
        accessorKey: 'medidas',
        header: 'Medidas',
      },
      {
        accessorKey: 'ultimo_estatus',
        header: 'Último estatus enviado',
        size: 300,
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => (
          <EstatusDropdownManiobra
            id_maniobra={cell.row.original.id_maniobra}
            ultimo_estatus={cell.getValue() || ''}
            usuario_ultimo_estatus={cell.row.original.usuario_ultimo_estatus}
            fecha_ultimo_estatus={cell.row.original.fecha_ultimo_estatus}
          />
        ),
      },
      {
        accessorKey: 'fecha_activacion',
        header: 'Fecha de inicio',
        size: 150,
      },
      {
        accessorKey: 'fecha_finalizada',
        header: 'Fecha finalizada',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
      {
        accessorKey: 'cartas_porte',
        header: 'Cartas porte',
        size: 150,
      },
      {
        accessorKey: 'nombre_cliente',
        header: 'Cliente',
        size: 150,
      },
      {
        accessorKey: 'usuario_creacion',
        header: 'Usuario registro',
        size: 150,
        Cell: ({ cell }: { cell: MRT_Cell<Maniobra> }) => {
          const nombre = cell.getValue<string>();
          const fecha_registro = cell.row.original.fecha_registro;

          return (
            <User
              avatarProps={{
                size: 'sm',
                color: 'primary',
                isBordered: true,
              }}
              description={fecha_registro}
              name={nombre}
            />
          );
        },
      },
      {
        accessorKey: 'estado_maniobra',
        header: 'Estado',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 250px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (!row.subRows?.length) {
          handleShowModal(row.original.id_maniobra, row.original);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '12px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    },

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">Maniobras del servicio</h1>
        <ul>
          {tipo_maniobra.map(branch => (
            <li key={branch.tipo}>
              <Checkbox
                isSelected={selectedManiobras.includes(branch.tipo)}
                onValueChange={(checked) => {
                  setSelectedManiobras(prev =>
                    checked
                      ? [...prev, branch.tipo]
                      : prev.filter(id => id !== branch.tipo)
                  );
                }}
              >
                <span>{branch.label}</span>
              </Checkbox>
            </li>
          ))}
        </ul>
        <Button color="primary" isLoading={isLoading} onPress={() => fetchData()} startContent={<i className="bi bi-arrow-clockwise"></i>} size="sm" radius="full">Refrescar</Button>
        <Button color="primary" isLoading={isLoading} onPress={() => crearAuto()} size="sm" radius="full">Crear maniobras</Button>
        <Button color='success' isLoading={isLoading} className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(filteredData, columns, `maniobras.csv`)} size="sm" radius="full">Exportar</Button>
      </Box >
    ),
  });

  return (
    <div>
      <Formulariomaniobra
        show={modalShow}
        handleClose={handleCloseModal}
        id_maniobra={id_maniobra}
        dataCP={dataCP}
      />
      <MaterialReactTable table={table} />
    </div >
  );

};

export default Maniobras;

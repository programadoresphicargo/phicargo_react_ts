import { Button } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';

type Props = {
  tipo_reporte: string;
};

const KMRecorridosOperadores: React.FC<Props> = ({
  tipo_reporte
}) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    if (!range) return;
    try {
      let url;
      setisLoading(true);
      if (tipo_reporte == "operadores") {
        url = `/drivers/stats/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data.distance_and_revenue_by_driver);
      } else if (tipo_reporte == "vehiculos") {
        url = `/vehicles/stats/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data.distance_and_revenue_by_vehicle);
      } else if (tipo_reporte == "sucursal") {
        url = `/tms_waybill/km_recorridos_sucursal/?start_date=${range[0].toISOString().slice(0, 10)}&end_date=${range[1].toISOString().slice(0, 10)}`;
        const response = await odooApi.get(url);
        setData(response.data);
      }
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const EnviarCorreo = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/drivers/correo_km_recorridos/`);
      console.log(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  let columnasExtra: any = [];

  if (tipo_reporte === 'operadores') {
    columnasExtra = [
      { accessorKey: 'driver', header: 'Operador' },
    ];
  }

  if (tipo_reporte === 'vehiculos') {
    columnasExtra = [
      { accessorKey: 'vehicle', header: 'Vehiculo' },
    ];
  }

  if (tipo_reporte === 'sucursal') {
    columnasExtra = [
      { accessorKey: 'sucursal', header: 'Sucursal' },
    ];
  }

  const columns = [
    ...columnasExtra,
    { accessorKey: 'year', header: 'Año' },
    { accessorKey: 'month', header: 'Periodo' },
    { accessorKey: 'distance', header: 'Distancia' },
    { accessorKey: 'travels_single', header: 'Viajes sencillos' },
    { accessorKey: 'travels_full', header: 'Viajes full' },
    { accessorKey: 'travels', header: 'Total viajes' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: "bottom",
    columnResizeMode: "onEnd",
    initialState: {
      grouping: ["year", "month"],
      density: 'compact',
      expanded: true,
      pagination: { pageIndex: 0, pageSize: 80 },
      showColumnFilters: true,
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 240px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length
          ? '#0456cf'
          : '#FFFFFF',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',

        color: row.subRows?.length
          ? '#FFFFFF'
          : '#000000',
      }
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          {tipo_reporte}
        </h1>

        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />

        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, `${tipo_reporte}.csv`)}
          color="success"
          className="text-white"
          radius="full"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="danger"
          className="text-white"
          radius="full"
        >
          Recargar
        </Button>
      </Box>
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default KMRecorridosOperadores;

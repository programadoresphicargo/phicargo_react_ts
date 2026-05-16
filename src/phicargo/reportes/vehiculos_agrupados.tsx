import { useMemo, useState } from 'react';

import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import CustomNavbar from "@/pages/CustomNavbar";

import {
  Button,
  Progress
} from '@heroui/react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  Bar,
  Pie
} from 'react-chartjs-2';

import {
  MRT_ColumnDef,
  MaterialReactTable
} from 'material-react-table';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const selectOptions = [
  { label: 'Modelo', value: 'model' },
  { label: 'Marca', value: 'brand' },
  { label: 'Año', value: 'model_year' },
];

const colors = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
];

const VehiculosAgrupados = () => {

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any[]>([]);

  const [groupedFields, setGroupedFields] = useState<string[]>([
    'model_year',
  ]);

  const handleChange = (
    event: SelectChangeEvent<string[]>
  ) => {

    const {
      target: { value },
    } = event;

    const values =
      typeof value === 'string'
        ? value.split(',')
        : value;

    if (values.length > 2) {

      toast.error(
        'Máximo 2 agrupaciones'
      );

      return;

    }

    setGroupedFields(values);

  };

  const fetchData = async () => {

    try {

      setIsLoading(true);

      const response = await odooApi.post(
        '/vehicles/grouped/', groupedFields,
      );

      setData(response.data);

    } catch (error: any) {

      toast.error(
        error?.response?.data?.detail ||
        'Error al obtener los datos'
      );

    } finally {

      setIsLoading(false);

    }

  };

  const chartData = useMemo(() => {

    if (!data.length) {

      return {
        labels: [],
        datasets: [],
      };

    }

    const level1 = groupedFields[0];

    const level2 = groupedFields[1];

    // ==========================
    // 1 NIVEL
    // ==========================

    if (groupedFields.length === 1) {

      return {

        labels: data.map(
          (item: any) => item[level1]
        ),

        datasets: [
          {

            label: 'Total',

            data: data.map(
              (item: any) => item.total
            ),

            backgroundColor:
              data.map(
                (_: any, index: number) =>
                  colors[index % colors.length]
              ),

          },
        ],

      };

    }

    // ==========================
    // 2 NIVELES
    // ==========================

    const labels = [
      ...new Set(
        data.map(
          (item: any) => item[level1]
        )
      )
    ];

    const secondaryGroups = [
      ...new Set(
        data.map(
          (item: any) => item[level2]
        )
      )
    ];

    const datasets = secondaryGroups.map(
      (group, index) => ({

        label: String(group),

        data: labels.map(label => {

          const found = data.find(
            (item: any) =>
              item[level1] === label &&
              item[level2] === group
          );

          return found
            ? found.total
            : 0;

        }),

        backgroundColor:
          colors[index % colors.length],

      })
    );

    return {
      labels,
      datasets,
    };

  }, [data, groupedFields]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [

      ...groupedFields.map((field) => ({

        accessorKey: field,

        header:
          field
            .replace(/_/g, ' ')
            .toUpperCase(),

      })),

      {
        accessorKey: 'total',
        header: 'TOTAL',
      },

    ],

    [groupedFields]
  );

  return (
    <>
      <CustomNavbar />

      {
        isLoading && (
          <Progress
            isIndeterminate
            size='sm'
          />
        )
      }

      <div className='p-4 flex flex-col gap-6'>

        {/* SELECT */}

        <FormControl sx={{ width: 400 }}>

          <InputLabel>
            Agrupar por
          </InputLabel>

          <Select
            multiple
            value={groupedFields}
            onChange={handleChange}
            input={
              <OutlinedInput label="Agrupar por" />
            }
          >

            {
              selectOptions.map((option) => (

                <MenuItem
                  key={option.value}
                  value={option.value}
                >

                  {option.label}

                </MenuItem>

              ))
            }

          </Select>

        </FormControl>

        {/* BOTON */}

        <div>

          <Button
            onPress={fetchData}
          >
            Ejecutar
          </Button>

        </div>

        {/* GRAFICA BARRAS */}

        {
          data.length > 0 && (
            <div
              style={{
                height: 500,
                background: '#fff',
                padding: 20,
                borderRadius: 12,
              }}
            >

              <Bar
                data={chartData}
              />

            </div>
          )
        }

        {/* PIE SOLO 1 NIVEL */}

        {
          data.length > 0 &&
          groupedFields.length === 1 && (
            <div
              style={{
                height: 500,
                background: '#fff',
                padding: 20,
                borderRadius: 12,
              }}
            >

              <Pie
                data={chartData}
              />

            </div>
          )
        }

        {/* TABLA */}

        <MaterialReactTable
          columns={columns}
          data={data}
          enableColumnFilters
          enableGrouping
          enablePagination
          enableDensityToggle
          enableFullScreenToggle
          enableColumnOrdering
          initialState={{
            density: 'compact',
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          }}
        />

      </div>
    </>
  );
};

export default VehiculosAgrupados;
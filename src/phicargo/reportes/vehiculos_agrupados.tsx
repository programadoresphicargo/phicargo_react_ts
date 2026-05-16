import { useEffect, useMemo, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import CustomNavbar from "@/pages/CustomNavbar";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import {
  Button,
  Card,
  CardBody,
  Progress
} from '@heroui/react';

import {
  Box,
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Bar,
  Pie
} from 'react-chartjs-2';

import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { exportToCSV } from '../utils/export';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
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

  useEffect(() => {
    if (!groupedFields.length) return;
    fetchData();
  }, [groupedFields]);

  const chartData = useMemo(() => {
    if (!data.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const level1 = groupedFields[0];
    const level2 = groupedFields[1];

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

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    groupedColumnMode: 'remove',
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    columnResizeMode: "onEnd",
    localization: MRT_Localization_ES,
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
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '12px',
      },
    },

    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
          color: row.subRows?.length ? '#FFFFFF' : '#000000',
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
        <h1
          className="font-semibold lg:text-2xl"
        >
          Vehiculos
        </h1>

        <Button
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "viajes_finalizados.csv")}
          radius='full'>
          Exportar
        </Button>
      </Box>
    ),
  });

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
            renderValue={(selected) =>
              selected.join(' > ')
            }
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


        {
          data.length > 0 && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {/* BARRAS */}
              <Card>
                <CardBody>
                  <div
                    style={{
                      position: 'relative',
                      height: '400px',
                      width: '100%',
                    }}
                  >

                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value,
                            font: {
                              weight: 'bold',
                            },
                          },
                        },
                      }}
                    />

                  </div>
                </CardBody>
              </Card>

              {/* PASTEL */}

              {
                groupedFields.length === 1 && (
                  <Card>
                    <CardBody>
                      <div
                        style={{
                          position: 'relative',
                          height: '400px',
                          width: '100%',
                        }}
                      >

                        <Pie
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                              datalabels: {
                                anchor: 'end',
                                align: 'top',
                                formatter: (
                                  value,
                                  context
                                ) => {

                                  const data =
                                    context.chart.data.datasets[0].data;

                                  const total = data.reduce(
                                    (a: any, b: any) =>
                                      Number(a) + Number(b),
                                    0
                                  );

                                  const percentage =
                                    ((value / total) * 100)
                                      .toFixed(1);

                                  return `${percentage}%`;

                                },
                              },
                            },
                          }}
                        />

                      </div>
                    </CardBody>
                  </Card>
                )
              }
            </div>
          )
        }

        <Card>
          <CardBody>
            <MaterialReactTable
              table={table}
            />
          </CardBody>
        </Card>

      </div>
    </>
  );
};

export default VehiculosAgrupados;
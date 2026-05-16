import { useState } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const selectOptions = [
  { label: 'Marca', value: 'brand' },
  { label: 'Año', value: 'model_year' },
  { label: 'Estado', value: 'status' },
];

const VehiculosAgrupados = () => {

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<any[]>([]);

  const [groupedFields, setGroupedFields] = useState<string[]>([
    "model_year"
  ]);

  const handleChange = (
    event: SelectChangeEvent<string[]>
  ) => {

    const {
      target: { value },
    } = event;

    setGroupedFields(
      typeof value === 'string'
        ? value.split(',')
        : value
    );

  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await odooApi.post(
        '/vehicles/grouped/', groupedFields
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

  const xField = groupedFields[0];

  const chartData = {

    labels: data.map(
      (item: any) => item[xField]
    ),

    datasets: [
      {
        label: 'Total',
        data: data.map(
          (item: any) => item.total
        ),
      },
    ],
  };

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
      <div className='p-4 flex flex-col gap-4'>
        <FormControl sx={{ width: 400 }}>
          <InputLabel>
            Agrupar por
          </InputLabel>

          <Select
            multiple
            value={groupedFields}
            onChange={handleChange}
            input={<OutlinedInput label="Agrupar por" />}
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
        <Button
          onPress={fetchData}
        >
          Ejecutar
        </Button>
        <>
          <div style={{ height: 400 }}>
            <Bar data={chartData} />
          </div>

          <div style={{ height: 400 }}>
            <Pie data={chartData} />
          </div>
        </>
      </div>
    </>
  );
};

export default VehiculosAgrupados;
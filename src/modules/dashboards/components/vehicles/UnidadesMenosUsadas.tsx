import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import odooApi from "@/api/odoo-api";
import { ChartCard } from "../ChartCard";
import { ExportConfig, ExportToExcel } from "@/utilities";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FleetUsage {
  name: string;
  total_usos: number;
}

export default function FleetUsageChart() {
  const [chartData, setChartData] = useState<ChartData<"bar">>();

  // 🔹 Función para obtener datos
  const fetchData = async () => {
    const { data } = await odooApi.get<FleetUsage[]>("/vehicles/least_used_active_fleet/");
    console.log(data);
    setChartData({
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: "Total de usos",
          data: data.map((item) => item.total_usos),
          borderWidth: 2,
          borderRadius: 10,
          backgroundColor: "rgba(40, 159, 64, 0.6)",
          borderColor: "rgba(40, 159, 64, 1)",
          barThickness: 30, // 🔹 tamaño fijo de cada barra
          maxBarThickness: 40, // 🔹 tamaño máximo si se autoajusta
        },
      ],
    });
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Exportar datos a Excel
  const exportAvailabilityData = async () => {
    try {
      const data = await fetchData();
      const exportConf: ExportConfig<FleetUsage> = {
        fileName: "Unidades menos usadas",
        withDate: false,
        sheetName: "Unidades menos usadas",
        columns: [
          { accessorFn: (d) => d.name, header: "Vehículo" },
          { accessorFn: (d) => d.total_usos, header: "Total de usos" },
        ],
      };
      new ExportToExcel(exportConf).exportData(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!chartData) return <p>Cargando gráfico...</p>;

  return (
    <ChartCard
      title="Ranking de uso de vehículos en viajes"
      customHeight="140rem"
      downloadFn={exportAvailabilityData}
    >
      <div className="w-4/5 mx-auto h-[130rem]">  {/* antes era 40rem */}
        <h2 className="text-xl font-bold text-center mb-4">Uso de Flota</h2>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            indexAxis: "y", // 🔹 Horizontal
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Ranking de uso de vehículos" },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                ticks: { font: { size: 14 } }, // letras más grandes
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

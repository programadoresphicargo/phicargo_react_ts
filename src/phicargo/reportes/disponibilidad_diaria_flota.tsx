import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import "./timeline.css";
import { DateRangePicker } from "rsuite";
import Travel from "../viajes/control/viaje";
import { DataGroup } from "vis-timeline";
import { RecordDetailsModal } from "@/modules/maintenance/components/RecordDetailsModal";
import { MaintenanceRecord } from "@/modules/maintenance/models";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import * as XLSX from "xlsx";

// 🧠 Tipo de datos del backend
interface Item {
  vehicle_id: number;
  name: string;
  tipo: "viaje" | "taller" | "asignacion" | "sin_asignar";
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
}

interface Conteo {
  viajes: number;
  taller: number;
  dias_viajes: number;
  dias_taller: number;
  dias_asignacion: number;
  dias_sin_asignar: number;
}

const DisponibilidadDiariaFlota: React.FC = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = now;

  const [range, setRange] = useState<[Date, Date] | null>([
    firstDay,
    lastDay
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [idViaje, setIDViaje] = useState<number | null>(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);

  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<Item[]>([]);

  const [openReport, setOpenReport] = useState(false);
  const [reportDetail, setReportDetail] = useState<MaintenanceRecord | null>(null);

  const exportToExcel = () => {
    if (!range || !data.length) return;

    const [inicio, fin] = range;

    const startDate = new Date(inicio);
    const endDate = new Date(fin);

    // ✅ usar fechas completas
    const days: string[] = [];
    let temp = new Date(startDate);

    while (temp <= endDate) {
      days.push(temp.toISOString().slice(0, 10)); // 👈 clave correcta
      temp.setDate(temp.getDate() + 1);
    }

    const vehicles = [...new Set(data.map((d) => d.name))];

    const result: any[] = [];

    vehicles.forEach((vehicle) => {
      const row: any = { name: vehicle };

      let diasViaje = 0;
      let diasTaller = 0;
      let diasAsignado = 0;
      let diasSinAsignacion = 0;

      // inicializar columnas
      days.forEach((d) => {
        row[d] = "";
      });

      const events = data.filter((d) => d.name === vehicle);

      events.forEach((event) => {
        // 🔢 sumar días
        if (event.tipo === "viaje") {
          diasViaje += event.dias || 0;
        }

        if (event.tipo === "taller") {
          diasTaller += event.dias || 0;
        }

        if (event.tipo === "asignacion") {
          diasAsignado += event.dias || 0;
        }

        if (event.tipo === "sin_asignar") {
          diasSinAsignacion += event.dias || 0;
        }

        let start = new Date(event.fecha_inicio);
        let end = new Date(event.fecha_fin);

        let current = new Date(start);

        while (current <= end) {
          const dayKey = current.toISOString().slice(0, 10);

          if (days.includes(dayKey)) {
            if (row[dayKey]) {
              row[dayKey] += `, ${event.tipo}`;
            } else {
              row[dayKey] = event.tipo;
            }
          }

          current.setDate(current.getDate() + 1);
        }
      });

      // columnas resumen
      row["dias_viaje"] = diasViaje;
      row["dias_taller"] = diasTaller;
      row["dias_asignado"] = diasAsignado;
      row["dias_sin_asignacion"] = diasSinAsignacion;
      result.push(row);
    });

    // 📄 headers (orden correcto)
    const headers = [
      "name",
      "dias_viaje",
      "dias_taller",
      "dias_asignado",
      "dias_sin_asignacion",
      ...days,
    ];

    const worksheet = XLSX.utils.json_to_sheet(result, {
      header: headers
    });

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Disponibilidad");

    XLSX.writeFile(workbook, "disponibilidad_flota.xlsx");
  };

  const fetchData = async () => {
    if (!range) return;

    try {
      setIsLoading(true);

      const [inicio, fin] = range;

      const res = await odooApi.get(
        `/vehicles/disponibilidad_diaria/?fecha_inicio=${inicio
          .toISOString()
          .slice(0, 10)}&fecha_fin=${fin.toISOString().slice(0, 10)}`
      );

      setData(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // 🚀 Cargar datos
  useEffect(() => {
    fetchData();
  }, [range]);

  // 🎯 Render cuando cambian datos o búsqueda
  useEffect(() => {
    if (data.length) {
      renderTimeline(data);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [data, search]);

  const renderTimeline = (data: Item[]) => {
    if (!containerRef.current) return;

    // 🧠 1. Conteo
    const conteo: Record<number, Conteo> = data.reduce(
      (acc, item) => {
        if (!acc[item.vehicle_id]) {
          acc[item.vehicle_id] = { viajes: 0, taller: 0, dias_viajes: 0, dias_taller: 0, dias_asignacion: 0, dias_sin_asignar: 0 };
        }

        if (item.tipo === "viaje") {
          acc[item.vehicle_id].viajes++;
          acc[item.vehicle_id].dias_viajes += item.dias || 0;
        } else if (item.tipo === "taller") {
          acc[item.vehicle_id].taller++;
          acc[item.vehicle_id].dias_taller += item.dias || 0;
        } else if (item.tipo === "asignacion") {
          acc[item.vehicle_id].dias_asignacion += item.dias || 0;
        } else if (item.tipo === "sin_asignar") {
          acc[item.vehicle_id].dias_sin_asignar += item.dias || 0;
        }

        return acc;
      },
      {} as Record<number, Conteo>
    );

    // 🎯 2. Grupos
    let groups = Object.values(
      data.reduce((acc: Record<number, DataGroup & { name: string }>, item) => {
        if (!acc[item.vehicle_id]) {
          const stats = conteo[item.vehicle_id];

          acc[item.vehicle_id] = {
            id: item.vehicle_id,
            content: `
              <div class="grupo-row">
                <div class="nombre">${item.name}</div>
                <div class="stats">
                  🚚 ${stats.viajes} viajes | 🕒 ${stats.dias_viajes} días
                </div>
                <div class="stats">
                🔧 ${stats.taller} reportes | 🕒 ${stats.dias_taller} días
              </div>
              </div>
            `,
            name: item.name // 👈 propiedad extra
          };
        }
        return acc;
      }, {})
    ) as (DataGroup & { name: string })[];

    // 🔍 3. Filtro
    if (search) {
      groups = groups.filter((g: any) =>
        g.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const groupIds = groups.map((g: any) => g.id);

    // 📊 4. Items
    const items = data
      .filter((item) => groupIds.includes(item.vehicle_id))
      .map((item) => ({
        id: `${item.tipo}-${item.id}`,
        content: item.nombre,
        start: item.fecha_inicio,
        end: item.fecha_fin,
        group: item.vehicle_id,
        className: item.tipo,
        title: `
          <b>${item.nombre}</b><br/>
          Tipo: ${item.tipo}<br/>
          ID: ${item.id}<br/>
          Inicio: ${item.fecha_inicio}<br/>
          Fin: ${item.fecha_fin}<br/>
        `,
        data: item
      }));

    // 🧹 destruir anterior
    if (timelineRef.current) {
      timelineRef.current.destroy();
    }

    // 🚀 Crear timeline
    timelineRef.current = new Timeline(
      containerRef.current,
      items,
      groups,
      {
        stack: true,
        orientation: "top",
        zoomMin: 1000 * 60 * 60 * 24,
        zoomMax: 1000 * 60 * 60 * 24 * 60
      }
    );

    const handleOpen = async (id: number) => {
      const response = await odooApi.get(`/maintenance-record/${id}`);
      setReportDetail(response.data);
      setOpenReport(true);
    };

    // 🖱️ Click
    timelineRef.current.on("select", (props: any) => {
      if (!props.items.length) return;

      const selectedItem = items.find((i) => i.id === props.items[0]);

      if (selectedItem) {
        const { tipo, id } = selectedItem.data;

        if (tipo === "viaje") {
          setIDViaje(id);
          handleClickOpen();
        } else if (tipo === "taller") {
          handleOpen(id);
        }
      }
    });
  };

  return (
    <div>

      <Travel idViaje={idViaje} open={open} handleClose={handleClose} />

      {reportDetail && (
        <RecordDetailsModal
          open={openReport}
          onClose={() => setOpenReport(false)}
          record={reportDetail}
        />
      )}

      <CustomNavbar />

      <div style={{ padding: "10px" }}>

        <div className="flex items-start gap-4 flex-wrap">
          <h1 className="text-xl font-semibold whitespace-nowrap">
            Ocupación diaria de flota
          </h1>

          <Input
            size="sm"
            variant="bordered"
            className="max-w-xs"
            label="Buscar vehiculo..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />

          <DateRangePicker
            value={range}
            onChange={(value: any) => setRange(value)}
            placeholder="Selecciona un rango de fechas"
            format="yyyy-MM-dd"
            loading={isLoading}
          />

          <Button
            color="success"
            onPress={() => fetchData()}
            radius="full"
            className="text-white"
            size="sm"
          >
            Recargar
          </Button>

          <Button
            color="primary"
            onPress={exportToExcel}
            radius="full"
            size="sm"
          >
            Exportar Excel
          </Button>
        </div>

        {isLoading && (
          <Progress isIndeterminate aria-label="Loading..." size="sm" />
        )}

        <div
          ref={containerRef}
          className="mi-timeline"
          style={{
            height: "500px",
            border: "1px solid #ccc"
          }}
        />
      </div>
    </div>
  );
};

export default DisponibilidadDiariaFlota;
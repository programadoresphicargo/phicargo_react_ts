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

// 🧠 Tipo de datos del backend
interface Item {
  vehicle_id: number;
  name: string;
  tipo: "viaje" | "taller";
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Conteo {
  viajes: number;
  taller: number;
}

const DisponibilidadDiariaFlota: React.FC = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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

  // 🚀 Cargar datos
  useEffect(() => {
    if (!range) return;

    const fetchData = async () => {
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
          acc[item.vehicle_id] = { viajes: 0, taller: 0 };
        }

        if (item.tipo === "viaje") acc[item.vehicle_id].viajes++;
        else acc[item.vehicle_id].taller++;

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
                  🚚 ${stats.viajes} | 🔧 ${stats.taller}
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
          ID: ${item.id}
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
        stack: false,
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
        } else {
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
        <h1>Disponibilidad de flota</h1>
        <input
          type="text"
          placeholder="Buscar operador..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "5px",
            width: "250px",
            marginBottom: "10px"
          }}
        />

        <DateRangePicker
          value={range}
          onChange={(value: any) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />

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
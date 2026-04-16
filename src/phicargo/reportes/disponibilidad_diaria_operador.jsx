import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import "./timeline.css";

const DisponibilidadDiariaOperadores = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState([]);

  useEffect(() => {
    odooApi
      .get("/drivers/disponibilidad_diaria/?fecha_inicio=2026-04-01&fecha_fin=2026-04-30")
      .then(res => setData(res.data));
  }, []);

  useEffect(() => {
    if (data.length) {
      renderTimeline(data);
    }
  }, [data, search]);

  const renderTimeline = (data) => {
    // 🎯 Agrupar conductores
    let groups = Object.values(
      data.reduce((acc, item) => {
        acc[item.driver_id] = {
          id: item.driver_id,
          content: item.name
        };
        return acc;
      }, {})
    );

    // 🔍 FILTRO
    if (search) {
      groups = groups.filter(g =>
        g.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    const groupIds = groups.map(g => g.id);

    // 📊 Items filtrados según grupos visibles
    const items = data
      .filter(item => groupIds.includes(item.driver_id))
      .map(item => ({
        id: `${item.tipo}-${item.id}`,
        content: item.nombre,
        start: item.fecha_inicio,
        end: item.fecha_fin,
        group: item.driver_id,
        className: item.tipo,
        data: item
      }));

    // ⚠️ destruir timeline anterior
    if (timelineRef.current) {
      timelineRef.current.destroy();
    }

    timelineRef.current = new Timeline(
      containerRef.current,
      items,
      groups,
      { stack: false, orientation: "top" }
    );
  };

  return (
    <div>
      <CustomNavbar></CustomNavbar>
      <input
        type="text"
        placeholder="Buscar conductor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        ref={containerRef}
        className="mi-timeline"
        style={{ height: "100px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default DisponibilidadDiariaOperadores;
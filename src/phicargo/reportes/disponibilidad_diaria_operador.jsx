import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import "./timeline.css";

const DisponibilidadDiariaOperadores = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  // 🚀 Cargar datos
  useEffect(() => {
    odooApi
      .get(
        "/drivers/disponibilidad_diaria/?fecha_inicio=2026-04-01&fecha_fin=2026-04-30"
      )
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

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

  const renderTimeline = (data) => {
    if (!containerRef.current) return;

    // 🧠 1. Contar viajes y talleres por operador
    const conteo = data.reduce((acc, item) => {
      if (!acc[item.driver_id]) {
        acc[item.driver_id] = {
          viajes: 0,
          taller: 0
        };
      }

      if (item.tipo === "viaje") {
        acc[item.driver_id].viajes++;
      } else {
        acc[item.driver_id].taller++;
      }

      return acc;
    }, {});

    // 🎯 2. Crear grupos con stats
    let groups = Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.driver_id]) {
          const stats = conteo[item.driver_id];

          acc[item.driver_id] = {
            id: item.driver_id,
            name: item.name,
            content: `
              <div class="grupo-row">
                <div class="nombre">${item.name}</div>
                <div class="stats">
                  🚚 ${stats.viajes} | 🔧 ${stats.taller}
                </div>
              </div>
            `
          };
        }
        return acc;
      }, {})
    );

    // 🔍 3. Filtro por búsqueda
    if (search) {
      groups = groups.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const groupIds = groups.map((g) => g.id);

    // 📊 4. Items filtrados
    const items = data
      .filter((item) => groupIds.includes(item.driver_id))
      .map((item) => ({
        id: `${item.tipo}-${item.id}`,
        content: item.nombre,
        start: item.fecha_inicio,
        end: item.fecha_fin,
        group: item.driver_id,
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
        zoomMin: 1000 * 60 * 60 * 24, // 1 día
        zoomMax: 1000 * 60 * 60 * 24 * 60 // 2 meses
      }
    );

    // 🖱️ Click
    timelineRef.current.on("select", (props) => {
      if (!props.items.length) return;

      const selectedItem = items.find((i) => i.id === props.items[0]);

      if (selectedItem) {
        const { tipo, id } = selectedItem.data;

        if (tipo === "viaje") {
          window.open(`/viajes/${id}`, "_blank");
        } else {
          window.open(`/taller/${id}`, "_blank");
        }
      }
    });
  };

  return (
    <div>
      <CustomNavbar />

      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Buscar operador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "5px",
            width: "250px",
            marginBottom: "10px"
          }}
        />

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

export default DisponibilidadDiariaOperadores;
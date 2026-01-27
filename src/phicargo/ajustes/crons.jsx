import React, { useState, useEffect } from "react";
import axios from "axios";
import odooApi from "../../api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from "./pages";
import { Button } from "@heroui/react";

export default function CronManager() {
 const [hora, setHora] = useState("");
 const [minuto, setMinuto] = useState("");
 const [diaSemana, setDiaSemana] = useState("");
 const [jobId, setJobId] = useState("");
 const [url, setUrl] = useState("");
 const [jobs, setJobs] = useState([]);

 const API_URL = "/cron_manager";

 useEffect(() => {
  fetchJobs();
 }, []);

 const fetchJobs = async () => {
  try {
   const res = await odooApi.get(`${API_URL}/cron`);
   setJobs(res.data);
  } catch (err) {
   console.error(err);
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const payload = {
    hora: parseInt(hora),
    minuto: parseInt(minuto),
    dia_semana: diaSemana,
    job_id: jobId,
    url: url
   };
   await odooApi.post(`${API_URL}/cron`, payload);
   alert("Job creado/actualizado");
   fetchJobs();
  } catch (err) {
   console.error(err);
   alert("Error creando job");
  }
 };

 const handleDelete = async (id) => {
  try {
   await odooApi.delete(`${API_URL}/cron/${id}`);
   fetchJobs();
  } catch (err) {
   console.error(err);
   alert("Error eliminando job");
  }
 };

 return (
  <>
   <CustomNavbar pages={pages}></CustomNavbar>
   <div style={{ padding: "20px" }}>
    <h2>Crear / Actualizar Cron Job</h2>
    <form onSubmit={handleSubmit}>
     <input type="text" placeholder="Job ID" value={jobId} onChange={e => setJobId(e.target.value)} required />
     <input type="number" placeholder="Hora (0-23)" value={hora} onChange={e => setHora(e.target.value)} required />
     <input type="number" placeholder="Minuto (0-59)" value={minuto} onChange={e => setMinuto(e.target.value)} required />
     <input type="text" placeholder="Días semana (mon,fri)" value={diaSemana} onChange={e => setDiaSemana(e.target.value)} required />
     <input type="text" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} required />
     <Button type="submit" color="primary" radius="full">Guardar Job</Button>
    </form>

    <h2 style={{ marginTop: "30px" }}>Jobs Activos</h2>
    <ul>
     {jobs.map((job) => (
      <li key={job.id}>
       {job.id} → Próxima ejecución: {job.next_run}{" "}
       <Button onClick={() => handleDelete(job.id)} color="success" className="text-white" size="sm" radius="full">Eliminar</Button>
      </li>
     ))}
    </ul>
   </div>
  </>
 );
}

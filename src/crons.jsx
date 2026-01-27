import React, { useState, useEffect } from "react";
import axios from "axios";
import odooApi from "./api/odoo-api";

export default function CronManager() {
 const [jobs, setJobs] = useState([]);
 const [form, setForm] = useState({
  minuto: "0",
  hora: "10",
  dia_mes: "*",
  mes: "*",
  dia_semana: "1,4",
  command: "",
  comentario: ""
 });

 const api = "/cron_manager/";

 // ---------------- Listar cron jobs ----------------
 const fetchJobs = async () => {
  const res = await odooApi.get(api);
  setJobs(res.data);
 };

 useEffect(() => {
  fetchJobs();
 }, []);

 // ---------------- Crear o Modificar ----------------
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const existing = jobs.find(j => j.comentario === form.comentario);
   if (existing) {
    await odooApi.put(`${api}/${form.comentario}`, form);
    alert("Cron modificado");
   } else {
    await odooApi.post(api, form);
    alert("Cron creado");
   }
   fetchJobs();
  } catch (err) {
   alert(err.response?.data?.detail || err.message);
  }
 };

 // ---------------- Eliminar ----------------
 const handleDelete = async (comentario) => {
  if (!window.confirm("¿Eliminar este cron?")) return;
  await odooApi.delete(`${api}/${comentario}`);
  fetchJobs();
 };

 return (
  <div style={{ padding: "20px" }}>
   <h2>Cron Jobs Manager</h2>

   {/* Formulario */}
   <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
    <input placeholder="Comentario" value={form.comentario} onChange={e => setForm({ ...form, comentario: e.target.value })} required />
    <input placeholder="Minuto" value={form.minuto} onChange={e => setForm({ ...form, minuto: e.target.value })} />
    <input placeholder="Hora" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
    <input placeholder="Día mes" value={form.dia_mes} onChange={e => setForm({ ...form, dia_mes: e.target.value })} />
    <input placeholder="Mes" value={form.mes} onChange={e => setForm({ ...form, mes: e.target.value })} />
    <input placeholder="Día semana" value={form.dia_semana} onChange={e => setForm({ ...form, dia_semana: e.target.value })} />
    <input placeholder="Comando" value={form.command} onChange={e => setForm({ ...form, command: e.target.value })} required />
    <button type="submit">Guardar</button>
   </form>

   {/* Lista de cron jobs */}
   <table border="1" cellPadding="5">
    <thead>
     <tr>
      <th>Comentario</th>
      <th>Horario</th>
      <th>Comando</th>
      <th>Acciones</th>
     </tr>
    </thead>
    <tbody>
     {jobs.map(j => (
      <tr key={j.comentario}>
       <td>{j.comentario}</td>
       <td>{`${j.minuto} ${j.hora} ${j.dia_mes} ${j.mes} ${j.dia_semana}`}</td>
       <td>{j.command}</td>
       <td>
        <button onClick={() => setForm(j)}>Editar</button>
        <button onClick={() => handleDelete(j.comentario)}>Eliminar</button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}

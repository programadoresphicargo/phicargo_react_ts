import React, { createContext, useContext, useState } from "react";

// Creamos el contexto
const DescuentosContext = createContext();

// Provider para envolver la app
export const DescuentosProvider = ({ children }) => {
 const [isEditing, setIsEditing] = useState(false);
 const [tareas, setRecords] = useState([]);

 const [selectedRows, setSelectedRows] = useState([]);
 const [participantes_nuevos, setParticipantesNuevos] = useState([]);
 const [eliminados_participantes, setEliminadosParticipantes] = useState([]);

 const [nuevas_tareas, setNuevasTareas] = useState([]);
 const [actualizadas_tareas, setActualizadasTareas] = useState([]);
 const [eliminadas_tareas, setEliminadasTareas] = useState([]);

 return (
  <DescuentosContext.Provider value={{
   selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords,
   nuevas_tareas, setNuevasTareas,
   actualizadas_tareas, setActualizadasTareas,
   eliminadas_tareas, setEliminadasTareas,
   participantes_nuevos, setParticipantesNuevos,
   eliminados_participantes, setEliminadosParticipantes
  }}>
   {children}
  </DescuentosContext.Provider>
 );
};

// Hook para consumir el contexto
export const useDescuentos = () => {
 const context = useContext(DescuentosContext);
 if (!context) {
  throw new Error("useDescuentos debe usarse dentro de un DescuentosProvider");
 }
 return context;
};

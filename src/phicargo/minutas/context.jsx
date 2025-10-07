import React, { createContext, useContext, useState } from "react";

// Creamos el contexto
const MinutasContext = createContext();

// Provider para envolver la app
export const MinutasProvider = ({ children }) => {
 const [selectedRows, setSelectedRows] = useState([]);
 const [isEditing, setIsEditing] = useState(false);
 const [tareas, setRecords] = useState([]);

 return (
  <MinutasContext.Provider value={{ selectedRows, setSelectedRows, isEditing, setIsEditing, tareas, setRecords }}>
   {children}
  </MinutasContext.Provider>
 );
};

// Hook para consumir el contexto
export const useMinutas = () => {
 const context = useContext(MinutasContext);
 if (!context) {
  throw new Error("useMinutas debe usarse dentro de un MinutasProvider");
 }
 return context;
};

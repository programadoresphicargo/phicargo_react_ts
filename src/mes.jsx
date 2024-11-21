import React, { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

const MonthSelector = ({ selectedMonth, handleChange }) => {
  return (
    <div>
      <Select
        label="Mes de busqueda"
        placeholder="Selecciona un mes"
        className="max-w-xs"
        onChange={handleChange}
        value={selectedMonth}
      >
        <SelectItem key={1}>Enero</SelectItem>
        <SelectItem key={2}>Febrero</SelectItem>
        <SelectItem key={3}>Marzo</SelectItem>
        <SelectItem key={4}>Abril</SelectItem>
        <SelectItem key={5}>Mayo</SelectItem>
        <SelectItem key={6}>Junio</SelectItem>
        <SelectItem key={7}>Julio</SelectItem>
        <SelectItem key={8}>Agosto</SelectItem>
        <SelectItem key={9}>Septiembre</SelectItem>
        <SelectItem key={10}>Octubre</SelectItem>
        <SelectItem key={11}>Noviembre</SelectItem>
        <SelectItem key={12}>Diciembre</SelectItem>
      </Select>
    </div>
  );
};

export default MonthSelector;

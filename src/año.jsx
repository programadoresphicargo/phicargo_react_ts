import React, { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

const YearSelector = ({ selectedYear, handleChange }) => {
    return (
        <div>
            <Select
                label="Año de búsqueda"
                placeholder="Selecciona un año"
                className="max-w-xs"
                onChange={handleChange}
                value={selectedYear}
                selectedKeys={[String(selectedYear)]}
                style={{ minWidth: "200px" }}
                variant='bordered'
                size="sm"
            >
                <SelectItem key={"2020"}>2020</SelectItem>
                <SelectItem key={"2021"}>2021</SelectItem>
                <SelectItem key={"2022"}>2022</SelectItem>
                <SelectItem key={"2023"}>2023</SelectItem>
                <SelectItem key={"2024"}>2024</SelectItem>
                <SelectItem key={"2025"}>2025</SelectItem>
                <SelectItem key={"2026"}>2026</SelectItem>
                <SelectItem key={"2027"}>2027</SelectItem>
                <SelectItem key={"2028"}>2028</SelectItem>
                <SelectItem key={"2029"}>2029</SelectItem>
            </Select>
        </div>
    );
};

export default YearSelector;

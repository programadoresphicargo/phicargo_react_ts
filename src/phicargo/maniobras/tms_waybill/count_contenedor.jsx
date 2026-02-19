import React, { useMemo } from "react";
import { HeaderBase } from "@/components/ui";
import { IndicatorCard } from "@/components/utils/IndicatorCard";
import { Checkbox } from "@heroui/react";

const branches = [
  { id: 1, label: "Veracruz" },
  { id: 2, label: "México" },
  { id: 9, label: "Manzanillo" },
];

const CountContenedor = ({
  filteredData = [],
  selectedBranches,
  setSelectedBranches,
}) => {

  /* =======================
     CONTADORES (SOLO FILTRADO)
  ======================= */
  const P = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "P").length,
    [filteredData]
  );

  const SM = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "sm").length,
    [filteredData]
  );

  const V = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "V").length,
    [filteredData]
  );

  const pm = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "pm").length,
    [filteredData]
  );

  const ER = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "ER").length,
    [filteredData]
  );

  const EI = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "EI").length,
    [filteredData]
  );

  const PR = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "PR").length,
    [filteredData]
  );

  const PI = useMemo(
    () => filteredData.filter(i => i.x_status_bel === "PI").length,
    [filteredData]
  );

  return (
    <HeaderBase backRoute="/menu">
      <div className="mx-8">
        <h1 className="text-md text-gray-100 font-bold">
          Pendientes <br /> de ingreso
        </h1>
      </div>

      <div className="flex gap-4 flex-1 items-start">

        {/* ===== FILTROS ===== */}
        <ul className="space-y-1">
          {branches.map(branch => (
            <li key={branch.id}>
              <Checkbox
                size="sm"
                isSelected={selectedBranches.includes(branch.id)}
                onValueChange={(checked) => {
                  setSelectedBranches(prev =>
                    checked
                      ? [...prev, branch.id]
                      : prev.filter(id => id !== branch.id)
                  );
                }}
              >
                <span className="text-white">{branch.label}</span>
              </Checkbox>
            </li>
          ))}
        </ul>

        {/* ===== INDICADORES ===== */}
        <IndicatorCard title="Sin maniobra" content={SM} isLoading={false} />
        <IndicatorCard title="En patio" content={P} isLoading={false} />
        <IndicatorCard title="Retiro programado" content={PR} isLoading={false} />
        <IndicatorCard title="En proceso de retiro" content={ER} isLoading={false} />
        <IndicatorCard title="Viaje" content={V} isLoading={false} />
        <IndicatorCard title="Ingreso programado" content={PI} isLoading={false} />
        <IndicatorCard title="En proceso de ingreso" content={EI} isLoading={false} />
        <IndicatorCard title="Patio México" content={pm} isLoading={false} />

      </div>
    </HeaderBase>
  );
};

export default CountContenedor;

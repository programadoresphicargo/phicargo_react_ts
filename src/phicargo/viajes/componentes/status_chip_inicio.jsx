import { Chip } from "@heroui/react";

export default function EstatusChipInicioViaje({ valor }) {
    let clase = "primary";

    if (valor === "Salio tarde") {
        clase = "danger";
    } else if (valor === "Va tarde") {
        clase = "warning";
    } else if (valor === "Llegó temprano") {
        clase = "primary";
    }

    return (
        <Chip color={clase} size="sm">
            {valor || "Sin información"}
        </Chip>
    );
}

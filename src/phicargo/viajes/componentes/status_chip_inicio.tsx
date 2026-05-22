import { Chip } from "@heroui/react";

export default function EstatusChipInicioViaje({ valor }: { valor: string }) {

    let color: "success" | "primary" | "default" | "secondary" | "warning" | "danger" = "default";

    if (valor === "Salio tarde") {
        color = "danger";
    } else if (valor === "Va tarde") {
        color = "warning";
    } else if (valor === "Llegó temprano") {
        color = "primary";
    }

    return (
        <Chip color={color} size="sm">
            {valor || "Sin información"}
        </Chip>
    );
}
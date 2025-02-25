// utils.jsx
export const getEstadoChip = (estado) => {
    switch (estado) {
        case "draft":
            return { color: "warning", text: "Borrador" };
        case "open":
            return { color: "primary", text: "Abierto" };
        case "paid":
            return { color: "success", text: "Pagado" };
        case "in_payment":
            return { color: "secondary", text: "En pago" };
        case "cancel":
            return { color: "danger", text: "Cancelado" };
        default:
            return { color: "default", text: "Sin estado" };
    }
};

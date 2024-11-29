export function tiempoTranscurrido(fechaDada) {
    const ahora = new Date();
    const fecha = new Date(fechaDada);
    const diferenciaMilisegundos = ahora - fecha;

    if (isNaN(fecha)) {
        return "Fecha no válida";
    }

    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias >= 1) {
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
        const fechaFormateada = fecha.toLocaleDateString("es-MX", opciones);

        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const periodo = hora >= 12 ? "p.m." : "a.m.";
        const hora12 = hora % 12 || 12;

        return `${fechaFormateada} ${hora12}:${minutos.toString().padStart(2, "0")} ${periodo}`;
    }

    if (segundos < 60) {
        return `hace ${segundos} segundos`;
    } else if (minutos < 60) {
        return `hace ${minutos} minutos`;
    } else if (horas < 24) {
        return `hace ${horas} horas`;
    }

    return `hace ${dias} días`; 
}

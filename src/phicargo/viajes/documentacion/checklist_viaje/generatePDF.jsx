import "jspdf-autotable";

import axios from "axios";
import jsPDF from "jspdf";
import odooApi from '@/api/odoo-api';

export const generatePDF = async (data, data_contenedores) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Checklist", 14, 20);

    const tableColumn = ["Tipo de checklist", "Equipo", "Registro", "Fecha"];
    const tableRows = data.map((item) => [item.tipo_checklist, item.name, item.nombre, item.fecha_creacion]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
        startY: 60,
    });

    let startY = doc.lastAutoTable.finalY + 10;

    for (const item of data) {
        try {
            const response = await odooApi.get(`/tms_travel/checklist/revisiones_checklist_equipos/id_checklist/${item.id_checklist}`);
            const posts = response.data;

            if (posts.length > 0) {
                doc.setFontSize(14);
                doc.text(`${item.name}`, 14, startY);
                startY += 10;
                doc.setFontSize(10);
                doc.text(`Tipo de checklist: ${item.tipo_checklist}`, 14, startY);
                startY += 5;
                doc.text(`Registro: ${item.nombre}`, 14, startY);
                startY += 5;
                doc.text(`Fecha de registro: ${item.fecha_creacion}`, 14, startY);
                startY += 5;

                const postTableColumn = ["Descripción", "Bien", "Mal", "Observaciones"];
                const postTableRows = posts.map((post) => [
                    post.nombre_elemento,
                    post.estado === true ? 'X' : '',
                    post.estado === false ? 'X' : '',
                    post.observaciones || "",
                ]);

                doc.autoTable({
                    head: [postTableColumn],
                    body: postTableRows,
                    startY: startY,
                    headStyles: {
                        fillColor: [0, 86, 109],
                        fontSize: 10,
                        fontStyle: 'bold',
                    },
                });

                startY = doc.lastAutoTable.finalY + 10;
            }
        } catch (error) {
            console.error(`Error al obtener datos de ID ${item.id_checklist}:`, error);
        }
    }

    startY = doc.lastAutoTable.finalY + 10;
    const tableColumnContenedores = ["Tipo de checklist", "Contenedor", "Registro", "Fecha"];
    const tableRowsContenedores = data_contenedores.map((item) => [item.tipo_checklist, item.x_reference, item.nombre, item.fecha_creacion]);

    doc.autoTable({
        head: [tableColumnContenedores],
        body: tableRowsContenedores,
        startY: startY,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
    });

    startY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Contenedores`, 14, startY);
    startY += 10;

    for (const itemContenedores of data_contenedores) {
        try {
            const responseContenedores = await odooApi.get(`/tms_travel/checklist/revisiones_checklist_contenedores/id_checklist/${itemContenedores.id_checklist}`);
            const postsContenedores = responseContenedores.data;

            if (postsContenedores.length > 0) {
                doc.setFontSize(14);
                doc.text(`${itemContenedores.x_reference}`, 14, startY);
                startY += 10;
                doc.setFontSize(10);
                doc.text(`Tipo de checklist: ${itemContenedores.tipo_checklist}`, 14, startY);
                startY += 5;
                doc.text(`Registro: ${itemContenedores.nombre}`, 14, startY);
                startY += 5;
                doc.text(`Fecha de registro: ${itemContenedores.fecha_creacion}`, 14, startY);
                startY += 5;

                const postTableColumnContenedores = ["Descripción", "Bien", "Mal", "Observaciones"];
                const postTableRowsContenedores = postsContenedores.map((post) => [
                    post.nombre_elemento,
                    post.estado === true ? 'X' : '',
                    post.estado === false ? 'X' : '',
                    post.observaciones || "",
                ]);

                doc.autoTable({
                    head: [postTableColumnContenedores],
                    body: postTableRowsContenedores,
                    startY: startY,
                    headStyles: {
                        fillColor: [0, 86, 109],
                        fontSize: 10,
                        fontStyle: 'bold',
                    },
                });

                startY = doc.lastAutoTable.finalY + 10;
            }
        } catch (error) {
            console.error(`Error al obtener datos de ID ${itemContenedores.id_checklist}:`, error);
        }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};

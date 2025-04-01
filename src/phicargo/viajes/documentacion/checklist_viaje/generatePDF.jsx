import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import odooApi from "@/phicargo/modules/core/api/odoo-api";

export const generatePDF = async (dataViaje, data, data_contenedores) => {
    const doc = new jsPDF();
    const imageUrl = 'https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png';
    const texto = 'INSPECCIÓN DE SEGURIDAD';

    doc.autoTable({
        startY: 30, 
        body: [
            [
                { image: imageUrl, width: 40, height: 40 }, 
                { content: texto, styles: { halign: 'center', fillColor: [0, 86, 109], textColor: [255, 255, 255] } } 
            ]
        ],
        columnStyles: {
            0: { cellWidth: 50 }, 
            1: { cellWidth: 140 }, 
        },
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        }
    });

    let startY = doc.lastAutoTable.finalY + 10; 

    const tableColumnViaje = ["Referencia de viaje", "Fecha"];
    const tableRowsViaje = [
        [
            dataViaje[0].name || "No disponible",
            dataViaje[0].date || "No disponible"
        ]
    ];

    const tableColumnViaje2 = ["Operador", "Licencia", "Vigencia"];
    const tableRowsViaje2 = [
        [
            dataViaje[0].employee?.name || "No disponible",
            dataViaje[0].employee?.tms_driver_license_id || "No disponible",
            dataViaje[0].employee?.tms_driver_license_expiration || "No disponible"
        ]
    ];

    const tableColumnViaje3 = ["Vehiculo", "Remolque 1", "Remolque 2", "Dolly"];
    const tableRowsViaje3 = [
        [
            dataViaje[0].vehicle?.name || "No disponible",
            dataViaje[0].trailer1?.name || "No disponible",
            dataViaje[0].trailer2?.name || "No disponible",
            dataViaje[0].dolly?.name || "No disponible"
        ]
    ];

    const tableColumnViaje4 = ["Ruta", "Modo", "Armado"];
    const tableRowsViaje4 = [
        [
            dataViaje[0].route?.name || "No disponible",
            dataViaje[0].x_modo_bel || "No disponible",
            dataViaje[0].x_tipo_bel || "No disponible"
        ]
    ];

    doc.setFontSize(18);
    doc.text("Detalles del Viaje", 14, 20);

    // Primera tabla: Viaje
    doc.autoTable({
        head: [tableColumnViaje],
        body: tableRowsViaje,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
        startY: startY,
    });

    startY = doc.lastAutoTable.finalY + 0;  

    // Segunda tabla: Operador
    doc.autoTable({
        head: [tableColumnViaje2],
        body: tableRowsViaje2,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
        startY: startY, 
    });

    startY = doc.lastAutoTable.finalY + 0;  

    doc.autoTable({
        head: [tableColumnViaje3],
        body: tableRowsViaje3,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
        startY: startY,  
    });

    startY = doc.lastAutoTable.finalY + 0;

    doc.autoTable({
        head: [tableColumnViaje4],
        body: tableRowsViaje4,
        headStyles: {
            fillColor: [0, 86, 109],
            fontSize: 10,
            fontStyle: 'bold',
        },
        startY: startY, 
    });

    startY = doc.lastAutoTable.finalY + 10; 

    doc.setFontSize(18);
    doc.text("Checklist", 14, startY);

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
        startY: startY + 20,
    });

    startY = doc.lastAutoTable.finalY + 10;

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
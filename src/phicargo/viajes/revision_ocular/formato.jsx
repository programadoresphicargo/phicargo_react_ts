import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const PDFReport = () => {
    const [data, setData] = useState([]);
    const imageUrl = "https://via.placeholder.com/150"; // URL de la imagen

    useEffect(() => {
        // Simulación de llamada a API
        setTimeout(() => {
            setData([
                { id: 1, nombre: "Producto A", precio: "$10" },
                { id: 2, nombre: "Producto B", precio: "$15" },
                { id: 3, nombre: "Producto C", precio: "$20" },
            ]);
        }, 1000);
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Agregar título
        doc.setFontSize(18);
        doc.text("Reporte de Productos", 14, 20);

        // Agregar imagen
        html2canvas(document.getElementById("logo")).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 150, 10, 40, 40); // (imagen, tipo, x, y, width, height)

            // Agregar tabla después de la imagen
            autoTable(doc, {
                startY: 60, // Posición donde empieza la tabla
                head: [["ID", "Nombre", "Precio"]],
                body: data.map((item) => [item.id, item.nombre, item.precio]),
            });

            // Guardar el PDF
            doc.save("reporte.pdf");
        });
    };

    return (
        <div>
            <iframe src="https://www.example.com" width="600" height="400" title="Example Website"></iframe>
        </div>
    );
};

export default PDFReport;

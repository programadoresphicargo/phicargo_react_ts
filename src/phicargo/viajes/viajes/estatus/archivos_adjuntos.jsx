import React, { useEffect, useState, useContext } from "react";
import FsLightbox from "fslightbox-react";
import { Progress } from "@nextui-org/react";
import { ViajeContext } from "../context/viajeContext";

function ArchivosAdjuntos({ id_reporte }) {
    const { id_viaje, estatusHistorial, getHistorialEstatus } = useContext(ViajeContext);
    const [isLoading, setLoading] = useState(false);
    const [images, setData] = useState([]);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    useEffect(() => {
        fetchData();
    }, [id_reporte]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/phicargo/viajes/historial_estatus/getAdjuntos.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_reporte: id_reporte
                }),
            });
            const jsonData = await response.json();
            setData(jsonData);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    const openLightboxOnSlide = (slide) => {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: slide
        });
    };

    // Convertimos `images` en una lista de URLs de imágenes para `FsLightbox`
    const imageSources = images.map(img => `/phicargo/archivos_viajes/${id_viaje}/${img.nombre_archivo}`);

    return (
        <ul class="list-group list-group-sm list-group-flush mt-2">
            <li class="list-group-item list-group-item-light">
                <div class="row">
                    <div class="col-12">

                        <h3>Archivos adjuntos</h3>
                        {isLoading ? (
                            <Progress
                                size="sm"
                                isIndeterminate
                                aria-label="Loading..."
                            />
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {images.map((img, index) => (
                                    <>
                                        <img
                                            key={`${img.id_onedrive}`}
                                            src={img.url_download}
                                            alt={`${img.id_onedrive}`}
                                            onClick={() => openLightboxOnSlide(index + 1)}
                                            style={{
                                                width: '150px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </>
                                ))}
                            </div>
                        )}

                        <FsLightbox
                            toggler={lightboxController.toggler}
                            sources={imageSources} // Usar las URLs de imágenes formateadas
                            slide={lightboxController.slide}
                        />
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default ArchivosAdjuntos;

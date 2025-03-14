import React, { useContext, useEffect, useState } from "react";

import FsLightbox from "fslightbox-react";
import { Image } from "antd";
import { Link } from "@heroui/react";
import { Progress } from "@heroui/react";
import { ViajeContext } from "../context/viajeContext";
const { VITE_PHIDES_API_URL } = import.meta.env;

function ArchivosAdjuntos({ id_reporte }) {
    const { id_viaje } = useContext(ViajeContext);
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
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/historial_estatus/getAdjuntos.php', {
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

    return isLoading ? (
        <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="mt-2"
        />
    ) : (
        images?.files?.length > 0 && (
            <ul class="list-group list-group-sm mt-2">
                <li class="list-group-item list-group-item-light">
                    <div className="row">
                        <div className="col-12">
                            <div>
                                <h4>Archivos adjuntos</h4>
                                <Image.PreviewGroup
                                    preview={{
                                        onChange: (current, prev) =>
                                            console.log(`current index: ${current}, prev index: ${prev}`),
                                    }}
                                >
                                    {images.files.map((item, index) => (
                                        <>
                                            <Link href={item.publicLink} isExternal showAnchorIcon>
                                                Ver archivo en OneDrive
                                            </Link>
                                            <Image
                                                key={index}
                                                width={100}
                                                height={100}
                                                src={`data:${item.contentType};base64,${item.content}`}
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100px',
                                                    height: '100px',
                                                }}
                                            />
                                        </>
                                    ))}
                                </Image.PreviewGroup>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        )
    );
}

export default ArchivosAdjuntos;

import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";
import odooApi from "@/api/odoo-api";

const Viewer = ({ id }) => {
    const [blobUrls, setBlobUrls] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!id) return;
        let isCancelled = false;

        const fetchAllBlobs = async () => {
            try {
                setLoading(true);
                const { data: archivos } = await odooApi.get(`/archivos/get_archivos/accesos/${id}`);
                const listaIds = archivos.map(item => item.id_onedrive).filter(Boolean);

                const urls = await Promise.all(listaIds.map(async (id_onedrive) => {
                    const { data: downloadUrl } = await odooApi.get(`/onedrive/download_link/${id_onedrive}`);
                    const response = await fetch(downloadUrl);
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                }));

                if (!isCancelled) setBlobUrls(urls);
            } catch (error) {
                console.error("Error al cargar archivos:", error);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        fetchAllBlobs();
        return () => { isCancelled = true; };
    }, [id]);

    useEffect(() => {
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [blobUrls]);

    return (
        <>
            {isLoading && (
                <Progress isIndeterminate aria-label="Cargando archivos..." size="sm" />
            )}

            {!isLoading && blobUrls.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: 20 }}>No hay archivos disponibles.</p>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '20px',
                    padding: '20px'
                }}
            >
                {blobUrls.map((url, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            backgroundColor: '#fff'
                        }}
                        onClick={() => setPreviewUrl(url)}
                    >
                        <img
                            src={url}
                            alt={`Imagen ${idx + 1}`}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                ))}
            </div>

            {previewUrl && (
                <div
                    onClick={() => setPreviewUrl(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        cursor: 'zoom-out'
                    }}
                >
                    <img
                        src={previewUrl}
                        alt="Vista ampliada"
                        style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8, boxShadow: '0 0 10px #000' }}
                    />
                </div>
            )}
        </>
    );
};

export default Viewer;

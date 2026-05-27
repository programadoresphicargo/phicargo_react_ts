import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Divider, Link } from "@heroui/react";
import { Progress } from "@heroui/react";
import odooApi from "@/api/odoo-api";

type Images = {
    webUrl: string;
    filename: string
}

function ArchivosAdjuntos({ id_reporte }: { id_reporte: number }) {

    const [isLoading, setLoading] = useState(false);
    const [images, setData] = useState<Images[]>([]);

    useEffect(() => {
        fetchData();
    }, [id_reporte]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/tms_travel/reportes_estatus_viajes/archivos/' + id_reporte);
            setData(response.data);
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
        images?.length > 0 && (
            <Card className="mt-5">
                <CardHeader>
                    Archivos Adjuntos
                </CardHeader>
                <Divider></Divider>
                <CardBody>
                    {images.map((item) => (
                        <div className="col-12">
                            <>
                                <Link href={item?.webUrl} isExternal showAnchorIcon>
                                    {item?.filename}
                                </Link>
                            </>
                        </div>
                    ))}
                </CardBody>
            </Card>
        )
    );
}

export default ArchivosAdjuntos;

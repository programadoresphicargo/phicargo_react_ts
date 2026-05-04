import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import odooApi from "@/api/odoo-api";
import { Progress } from "@heroui/react";

type Props = {
    id_onedrive: string;
    open: boolean;
    onClose: () => void;
};

const OneDriveViewerDialog = ({ id_onedrive, open, onClose }: Props) => {

    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id_onedrive) return;

        const fetchBlob = async () => {
            try {
                setLoading(true);
                const response_download = await odooApi.get<string>('/onedrive/download_link/' + id_onedrive);
                const response = await fetch(response_download.data);
                const blob = await response.blob();
                const localUrl = URL.createObjectURL(blob);
                setBlobUrl(localUrl);
                setLoading(false);
            } catch (error) {
                console.error("Error al convertir en blob:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlob();
    }, [id_onedrive]);

    useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullScreen>
            <DialogTitle>
                Vista previa
                <IconButton
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {isLoading && (
                <Progress isIndeterminate aria-label="Loading..." size="sm" />
            )}

            <DialogContent>
                {blobUrl ? (
                    <iframe
                        src={blobUrl}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title="Viewer"
                    />
                ) : (
                    !isLoading && <p>No se pudo cargar el archivo</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default OneDriveViewerDialog;

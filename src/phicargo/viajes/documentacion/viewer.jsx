import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import odooApi from "@/api/odoo-api";

const OneDriveViewerDialog = ({ open, onClose, id_onedrive }) => {
    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
        if (!id_onedrive) return;

        const fetchBlob = async () => {
            try {
                const response_download = await odooApi.get('/onedrive/download_link/' + id_onedrive);
                const response = await fetch(response_download.data);
                const blob = await response.blob();

                const localUrl = URL.createObjectURL(blob);
                setBlobUrl(localUrl);
            } catch (error) {
                console.error("Error al convertir en blob:", error);
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
                Vista previa del archivo
                <IconButton
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <iframe
                    src={blobUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Viewer"
                />
            </DialogContent>
        </Dialog>
    );
};

export default OneDriveViewerDialog;

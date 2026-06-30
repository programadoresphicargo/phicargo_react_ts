import {
  Button, Progress,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  DialogTitle,
} from "@mui/material";
import { useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  handleClose: () => void;
  accoundId: number | null;
};

const ImportarArchivoExcel = ({ open, handleClose, accoundId }: Props) => {

  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const importarArchivo = async () => {
    if (!file) {
      toast.error("Selecciona un archivo");
      return;
    }

    try {
      toast.success("Procesando...");
      setLoading(true);

      const formData = new FormData();
      formData.append("account_id", String(accoundId));
      formData.append("file", file);

      const response = await odooApi.post(
        "/payments/importar-excel/",
        formData
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        handleClose();
      }
    } catch (error: any) {
      console.error(error);

      const message =
        error.response?.data?.detail || "Error al importar el archivo";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >

        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #0b2149, #002887)',
            position: 'relative',
          }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontFamily={"Inter"}
          >
            <Typography variant="h6" color="white" fontFamily={"Inter"}>
              {'Nuevo Pago'}
            </Typography>
          </Box>
        </DialogTitle>

        {(isLoading && (<Progress isIndeterminate size="sm"> </Progress>))}
        <DialogContent dividers>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
            }}
          />
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button
              color="primary"
              radius="full"
              isLoading={isLoading}
              onPress={importarArchivo}
              isDisabled={!file}
            >
              Importar
            </Button>

            <Button
              onPress={handleClose}
              color="danger"
              radius="full"
            >
              Cerrar
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportarArchivoExcel;

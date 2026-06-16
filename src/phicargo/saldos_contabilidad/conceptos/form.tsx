import {
  Button, Progress,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { useForm } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  handleClose: () => void;
  conceptId: number | null;
};

type PaymentConcept = {
  name: string | null;
}

const PaymentConceptsForm = ({ open, handleClose, conceptId }: Props) => {

  const initialForm: PaymentConcept = {
    name: null,
  }

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<PaymentConcept>({
    defaultValues: initialForm,
  });

  const fetchPayment = async (id: number) => {
    try {
      setLoading(true);

      const response = await odooApi.get(`/payment_concepts/${id}`);
      reset(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (conceptId) {
      fetchPayment(conceptId);
    } else {
      reset({
        name: null,
      });
    }
  }, [open, conceptId]);

  const [isLoading, setLoading] = useState(false);

  const SavePayment = async (data: PaymentConcept) => {

    try {
      setLoading(true);

      let response;

      if (conceptId) {
        response = await odooApi.patch(`/payment_concepts/${conceptId}`, data);
      } else {
        response = await odooApi.post('/payment_concepts/', data);
      }

      if (response.data.status == "success") {
        toast.success(response.data.message);
        reset({
          name: null
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
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
        <DialogTitle>
          Registro
        </DialogTitle>
        {(isLoading && (<Progress isIndeterminate size="sm"> </Progress>))}
        <DialogContent dividers>

          <Box display="flex" flexDirection="column" gap={2}>

            <div>
              <Button
                color={conceptId ? 'success' : 'primary'}
                className="text-white"
                onPress={() => handleSubmit(SavePayment)()}
              >
                {conceptId ? 'Actualizar' : 'Registrar'}
              </Button>
            </div>

            <TextFieldElement
              control={control}
              name="name"
              label="Nombre"
              size="small"
              fullWidth
              rules={{ required: "Campo obligatorio" }}
            />

          </Box>

        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentConceptsForm;

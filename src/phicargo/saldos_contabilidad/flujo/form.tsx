import {
  Button, Progress,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { Cuenta } from ".";
import { ContactsSearchInputMatch } from "@/modules/contacts/components/inputs/ContactsSearchInputMatch";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerElement } from "react-hook-form-mui/date-pickers";
import { Delete } from "@mui/icons-material";
import { AutocompleteElement, SelectElement, TextFieldElement } from "react-hook-form-mui";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  handleClose: () => void;
  Cuenta: Cuenta;
  paymentId: number | null;
};

type Details = {
  category_id: number | null;
  amount: number;
}

type Concepts = {
  id: number;
  label: string;
}

type ConceptsResponse = {
  id: number;
  name: string;
}

type FlujoForm = {
  account_id: number | null;
  provider_id: number | null;
  provider_name?: string | null;
  concept_id: number | null;
  comments: string | null;
  payment_date: Dayjs;
  details: Details[]
}

const FlujoForm = ({ open, handleClose, Cuenta, paymentId }: Props) => {

  const [concepts, setConcepts] = React.useState<Concepts[]>([]);
  const categories = [{ id: 1, label: "Gasto" }];

  const initialForm: FlujoForm = {
    account_id: null,
    provider_id: null,
    concept_id: null,
    comments: null,
    payment_date: dayjs(),
    details: [{ category_id: null, amount: 0 }],
  }

  const {
    control,
    handleSubmit,
    reset,
    watch
  } = useForm<FlujoForm>({
    defaultValues: initialForm,
  });

  const provider_name = watch("provider_name");

  const {
    fields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: 'details',
  });

  const fetchPayment = async (id: number) => {
    try {
      setLoading(true);

      const response = await odooApi.get(`/payments/${id}`);
      const payment = response.data;

      const detailsData = payment.details.map((item: any) => ({
        category_id: item.category_id,
        amount: Number(item.amount),
      }));

      replace(detailsData);

      reset({
        account_id: payment.account_id,
        provider_id: payment.provider_id,
        provider_name: payment.provider_name,
        concept_id: payment.concept_id,
        comments: payment.comments,
        payment_date: dayjs(payment.payment_date),
        details: detailsData,
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (paymentId) {
      fetchPayment(paymentId);
    } else {
      reset({
        account_id: Cuenta.id_cuenta,
        provider_id: null,
        concept_id: null,
        comments: null,
        payment_date: dayjs(),
        details: [{ category_id: 1, amount: 0 }],
      });
    }
  }, [open, paymentId]);

  const [isLoading, setLoading] = useState(false);

  const SavePayment = async (data: FlujoForm) => {

    if (data.details.length === 0) {
      toast.error('Debe agregar al menos un concepto');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...data,
        payment_date: data.payment_date
          ?.toISOString()
          .split('T')[0],
      };

      let response;

      if (paymentId) {
        response = await odooApi.patch(`/payments/${paymentId}`, payload);
      } else {
        response = await odooApi.post('/payments/', payload);
      }

      if (response.data.status == "success") {
        toast.success(response.data.message);
        reset({
          account_id: Cuenta.id_cuenta,
          provider_id: null,
          concept_id: null,
          comments: null,
          payment_date: dayjs(),
          details: [{ category_id: null, amount: 0 }],
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConcepts = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get<ConceptsResponse[]>(`/payments/concepts/`);
      setConcepts(
        response.data.map((item) => ({
          id: item.id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'category_id',
        header: 'Categoría',
        Cell: ({ row }) => (
          <Controller
            control={control}
            name={`details.${row.index}.category_id`}
            rules={{
              required: 'Seleccione una categoría',
            }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                size="small"
                fullWidth
                error={!!fieldState.error}
              >
                {categories.map((c) => (
                  <MenuItem
                    key={c.id}
                    value={c.id}
                  >
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        ),
      },
      {
        accessorKey: 'importe',
        header: 'Importe',
        Cell: ({ row }) => (
          <Controller
            control={control}
            name={`details.${row.index}.amount`}
            rules={{
              required: 'Ingrese un importe',
              min: {
                value: 0.01,
                message: 'El importe debe ser mayor a cero',
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                size="small"
                fullWidth
                error={!!fieldState.error}
              />
            )}
          />
        ),
      },
      {
        id: 'acciones',
        header: '',
        Cell: ({ row }) => (
          <IconButton
            color="error"
            onClick={() => remove(row.index)}
          >
            <Delete />
          </IconButton>
        ),
      },
    ],
    [control, remove, concepts]
  );

  const table = useMaterialReactTable({
    columns,
    data: fields,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    groupedColumnMode: "remove",
    state: { showProgressBars: isLoading },
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: () => ({
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.getCanExpand() ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.getCanExpand() ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Button
              color="success"
              className="text-white"
              radius="full"
              onPress={() =>
                append({
                  category_id: null,
                  amount: 0,
                })
              }
            >
              Agregar
            </Button>
          </div>
        </div>
      </Box>
    ),
  });

  const details = useWatch({
    control,
    name: 'details',
  });

  const total = (details ?? []).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >

        <AppBar
          sx={{
            background: 'linear-gradient(90deg, #0b2149, #002887)',
            position: 'relative',
            padding: '0 16px'
          }}
          elevation={0}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Registro
            </Typography>
            <Button autoFocus onPress={handleClose} color="primary">
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>

        {(isLoading && (<Progress isIndeterminate size="sm"> </Progress>))}
        <DialogContent dividers>

          <Box display="flex" flexDirection="column" gap={2}>

            <div>
              <Button
                color={paymentId ? 'success' : 'primary'}
                className="text-white"
                onPress={() => handleSubmit(SavePayment)()}
                radius="full"
              >
                {paymentId ? 'Actualizar' : 'Registrar'}
              </Button>
            </div>

            <DatePickerElement
              control={control}
              name="payment_date"
              label="Fecha"
              rules={{ required: "Campo obligatorio" }}
              required
              inputProps={{
                size: 'small',
                fullWidth: true,
              }}
            />

            <ContactsSearchInputMatch
              initialInputValue={provider_name ?? ""}
              control={control}
              name="provider_id"
              label="Proveedor"
              placeholder="Buscar cliente..."
              rules={{ required: "Campo obligatorio" }}
            />

            <AutocompleteElement
              options={concepts}
              control={control}
              name="concept_id"
              label="Concepto"
              rules={{ required: "Campo obligatorio" }}
              autocompleteProps={{
                size: "small"
              }}
            />

            <TextFieldElement
              control={control}
              name="comments"
              label="Comentarios"
              size="small"
              fullWidth
              rules={{ required: "Campo obligatorio" }}
            />

          </Box>

          <MaterialReactTable table={table} />

          <Typography variant="h6">
            Total: ${total.toLocaleString()}
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlujoForm;

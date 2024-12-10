import { Button, Form, Modal } from "rsuite";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePayments, useWeekContext } from "../hooks";

import toast from 'react-hot-toast';
import { useMemo } from "react";
import { useProviders } from "../hooks/useProviders";

interface OptionsSelection {
  providerId: string | number;
  concept: string;
  amount: number;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"; 
}

const daysSelection = [
  { label: "Lunes", value: "monday" },
  { label: "Martes", value: "tuesday" },
  { label: "Miercoles", value: "wednesday" },
  { label: "Jueves", value: "thursday" },
  { label: "Viernes", value: "friday" },
  { label: "Sabado", value: "saturday" },
]

const initialFormState: OptionsSelection = {
  providerId: "",
  concept: "",
  amount: null as unknown as number,
  day: "" as unknown as OptionsSelection["day"],
};

interface NewPaymentFormProps {
  handleClose: () => void;
}

const NewPaymentForm = (props: NewPaymentFormProps) => {
  const { handleClose } = props;

  const { activeWeekId } = useWeekContext();

  const { control, handleSubmit } = useForm({
    defaultValues: initialFormState,
  });

  const {
    providersQuery: { data: providers, isFetching, isError },
  } = useProviders();

  const {
    createPaymentMutation: { mutate: createRegister },
  } = usePayments();

  const onSubmit: SubmitHandler<OptionsSelection> = (data) => {
    if(!activeWeekId) {
      toast.error("No hay una semana activa");
    };
    const newPayment = {
      weekId: Number(activeWeekId),
      providerId: Number(data.providerId),
      providerName: providers?.find((item) => item.id === data.providerId)?.name || "",
      concept: data.concept,
      day: data.day,
      amount: Number(data.amount),
    }
    // console.log(newPayment);
    createRegister(newPayment);
  }

  const data = useMemo(() => {
    if (isFetching || isError) return [];
    return providers?.map((item) => ({ label: item.name, value: item.id }));
  }, [providers, isError, isFetching]);

  return (
    <Modal 
      open={true} 
      onClose={handleClose}
      size="xs"
      style={{
        padding: "2px",
        overflow: "hidden",
      }}
    >
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0",
          margin: "0",
        }}
      >
        <h3>Nuevo Registro</h3>
        <Form
          style={{
            margin: "1rem",
          }}
        >
          {/* <SelectInput 
            control={control}
            controlId="providerId"
            name="providerId"
            label="Proveedor" 
            items={data || []}
            style={{ width: 300 }}
            rules={{ required: "Selecciona un provedor por favor" }}
            isLoading={isFetching}
            virtualized
          />

          <SelectInput 
            control={control}
            controlId="day"
            name="day"
            label="Día" 
            items={daysSelection}
            style={{ width: 300 }}
            rules={{ required: "Selecciona un día por favor" }}
          />

          <NumberInput 
            control={control}
            label="Monto"
            name="amount"
            rules={{ required: "Ingresa un monto por favor" }}
          />

          <TextInput 
            control={control}
            label="Concepto"
            name="concept"
            rules={{ required: "Ingresa un concepto por favor" }}
          /> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="ghost" color="red">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          appearance="primary"
        >
          Insertar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewPaymentForm;

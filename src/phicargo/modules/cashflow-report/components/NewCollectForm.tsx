import { Button, Form, Modal } from "rsuite";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCollectRegisters, useWeekContext } from "../hooks";

import toast from 'react-hot-toast';

// import { useClients } from "../hooks/useClients";
// import { useMemo } from "react";

interface OptionsSelection {
  clientId: string | number;
  mount: number;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";  
}

// const daysSelection = [
//   { label: "Lunes", value: "monday" },
//   { label: "Martes", value: "tuesday" },
//   { label: "Miercoles", value: "wednesday" },
//   { label: "Jueves", value: "thursday" },
//   { label: "Viernes", value: "friday" },
//   { label: "Sabado", value: "saturday" },
// ]

const initialFormState: OptionsSelection = {
  clientId: "",
  mount: 0,
  day: "" as unknown as OptionsSelection["day"],
};

interface NewCollectFormProps {
  handleClose: () => void;
}

const NewCollectForm = (props: NewCollectFormProps) => {
  const { handleClose } = props;

  const { activeWeekId } = useWeekContext();

  const { handleSubmit } = useForm({
    defaultValues: initialFormState,
  });

  // const {
  //   clientsQuery: { data: clients, isFetching, isError },
  // } = useClients();

  const {
    createCollectRegisterMutation: { mutate: createRegister },
  } = useCollectRegisters();

  const onSubmit: SubmitHandler<OptionsSelection> = (data) => {
    if(!activeWeekId) {
      toast.error("No hay una semana activa");
    };
    createRegister({
      weekId: Number(activeWeekId),
      clientId: Number(data.clientId),
      mount: Number(data.mount),
      day: data.day,
    });
  }

  // const data = useMemo(() => {
  //   if (isFetching || isError) return [];
  //   return clients?.map((item) => ({ label: item.name, value: item.id }));
  // }, [clients, isError, isFetching]);

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
            controlId="clientId"
            name="clientId"
            label="Cliente" 
            items={data || []}
            style={{ width: 300 }}
            rules={{ required: "Selecciona un cliente por favor" }}
            isLoading={isFetching}
            virtualized
          />
          <SelectInput 
            control={control}
            controlId="dayId"
            name="day"
            label="Día" 
            items={daysSelection}
            style={{ width: 300 }}
            rules={{ required: "Selecciona un día por favor" }}
          />

          <NumberInput 
            control={control}
            name="mount"
            label="Monto"
            rules={{ required: "Ingresa un monto" }}
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

export default NewCollectForm;

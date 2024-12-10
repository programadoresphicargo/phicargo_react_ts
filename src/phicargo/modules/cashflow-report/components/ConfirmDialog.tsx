import { Button, Form, Modal } from "rsuite";
import { DaysOfWeek, WeekBase } from "../models";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCollectRegisters, usePayments } from "../hooks";

import { CheckboxInput } from "../../core/components/inputs/CheckboxInput";

interface Confirmation {
  totalAmount: boolean;
  realAmount: number;
}

const formInitialState: Confirmation = {
  totalAmount: true,
  realAmount: 0,
};

interface ConfirmDialogProps {
  onClose: () => void;
  item: WeekBase & { id: number };
  type: "collect" | "payment";
  dayOfWeek: DaysOfWeek
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { onClose, item, type, dayOfWeek } = props;

  const {
    confirmCollectMutation: { mutate: confirmCollect },
  } = useCollectRegisters();

  const {
    confirmPaymentMutation: { mutate: confirmPayment },
  } = usePayments();

  const { control, handleSubmit } = useForm<Confirmation>({
    defaultValues: formInitialState,
  });

  // const totalAmount = watch("totalAmount");

  const onConfirm: SubmitHandler<Confirmation> = (data) => {
    const confirmation = {
      itemId: item.id,
      dayOfWeek: dayOfWeek,
      confirmed: true,
      amount: data.totalAmount ? item[dayOfWeek].amount : data.realAmount,
    }

    if(type === "collect"){
      confirmCollect(confirmation);
    } else {
      confirmPayment(confirmation);
    }
    onClose();
  };

  return (
    <>
      <Modal 
        role="alertdialog" 
        open={true} 
        onClose={onClose} 
        size="300px"
      >
        <Modal.Body
          style={{
            overflow: "hidden",
            height: "175px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <RemindIcon
              style={{ color: "#ffb300", fontSize: 24, marginRight: "8px" }}
            /> */}
            <h4>¿Confirmar Pago?</h4>
          </div>

          <Form>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                marginTop: "10px",
              }}
            >
              <CheckboxInput
                control={control}
                name="totalAmount"
                label="Monto Total"
                // defaultChecked
              />
            </div>

            {/* <NumberInput
              control={control}
              name="realAmount"
              label="Monto a Confirmar"
              rules={
                totalAmount
                  ? {}
                  : {
                      min: {
                        value: 1,
                        message: "La cantidad debe de ser mayor a 0",
                      },
                    }
              }
              style={{ maxWidth: "100%" }}
              isDisabled={totalAmount}
            /> */}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleSubmit(onConfirm)} appearance="primary">
            Confirmar
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDialog;

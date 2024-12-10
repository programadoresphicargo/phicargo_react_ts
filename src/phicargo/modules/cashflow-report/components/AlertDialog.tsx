import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

interface AlertDialogProps {
  alert: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}

const AlertDialog = (props: AlertDialogProps) => {
  const { onClose, onConfirm, alert, description } = props;

  return (
    <>
      <Modal isOpen={true} size={'sm'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
                <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                  Completar Registro
                </h3>
              </ModalHeader>
              <ModalBody>
                <h2>{alert}</h2>
                <p>{description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={onConfirm}>
                  Completar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* <Modal role="alertdialog" open={true} onClose={onClose} size="300px">
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
            <RemindIcon
              style={{ color: "#ffb300", fontSize: 24, marginRight: "8px" }}
            />
            <h4>{alert}</h4>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
              height: "100%",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            <p>{description}</p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={onConfirm} appearance="primary">
            Confirmar
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default AlertDialog;

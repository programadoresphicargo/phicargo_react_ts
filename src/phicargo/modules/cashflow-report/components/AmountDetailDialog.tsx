import { Button, Modal } from "rsuite";

import { Amount } from "../models";
import { formatCurrency } from '../utils/format-currency';

interface AmountDetailDialogProps {
  onClose: () => void;
  amount: Amount;
}

const AmountDetailDialog = (props: AmountDetailDialogProps) => {
  const { onClose, amount } = props;

  return (
    <Modal 
      role="alertdialog" 
      open={true} 
      onClose={onClose} 
      size="xs"
    >
      <Modal.Header>
        <h4 style={{ margin: 0 }}>Detalles de la Cantidad</h4>
      </Modal.Header>
      
      <Modal.Body
        style={{
          padding: "15px",
          maxHeight: "200px", // Puedes ajustar la altura máxima
          overflowY: "auto",  // Permitir scroll si el contenido es más grande
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ccc" }}>Descripción</th>
              <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ccc" }}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>Proyectado</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{formatCurrency(amount.amount)}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>Confirmado</td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>{formatCurrency(amount.realAmount)}</td>
            </tr>
          </tbody>
        </table>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose} appearance="primary">
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AmountDetailDialog;

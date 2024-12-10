import Header from '../components/Header';
import NewPaymentForm from '../components/NewPaymentForm';
import PaymentTable from '../components/tables/PaymentTable';
import { useState } from 'react';

const PaymentReportView = () => {
  const [newRegister, setNewRegister] = useState(false);

  return (
    <>
      <Header />

      <div
        style={{
          paddingTop: '10px',
        }}
      >
        <PaymentTable createFn={() => setNewRegister(true)} />
      </div>

      {newRegister && (
        <NewPaymentForm handleClose={() => setNewRegister(false)} />
      )}
    </>
  );
};

export default PaymentReportView;

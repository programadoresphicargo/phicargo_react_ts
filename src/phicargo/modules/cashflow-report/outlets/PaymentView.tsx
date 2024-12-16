import { Outlet } from 'react-router-dom';
import PaymentTable from '../components/tables/PaymentTable';

const PaymentView = () => {
  return (
    <>
      <PaymentTable />
      <Outlet />
    </>
  );
};

export default PaymentView;

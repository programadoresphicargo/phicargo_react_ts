import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import CashflowLayout from '../Layout/CashflowLayout';
import { LoadingPage } from '../../core/pages/LoadingPage';

const CollectView = lazy(() => import('../outlets/CollectView'));
const PaymentView = lazy(() => import('../outlets/PaymentView'));

const CashflowReportRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CashflowLayout children={undefined} />}>
        <Route
          path="collect"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CollectView />
            </Suspense>
          }
        ></Route>
        <Route
          path="payment"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PaymentView />
            </Suspense>
          }
        ></Route>
      </Route>
    </Routes>
  );
};

export default CashflowReportRoutes;


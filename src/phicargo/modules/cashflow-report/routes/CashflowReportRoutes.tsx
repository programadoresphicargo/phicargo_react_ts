import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import CashflowLayout from '../Layout/CashflowLayout';
import { LoadingPage } from '../../core/pages/LoadingPage';
import ProtectedRoute from '../../../../router/ProtectedRoute';

const CollectView = lazy(() => import('../outlets/CollectView'));
const NewCollectForm = lazy(() => import('../outlets/NewCollectForm'));
const PaymentView = lazy(() => import('../outlets/PaymentView'));
const NewPaymentForm = lazy(() => import('../outlets/NewPaymentForm'));

const PERMISSION_ID = 197;

const CashflowReportRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute 
            element={<CashflowLayout children={undefined} />}
            requiredPermissionId={PERMISSION_ID}
          />
        }
      >
        <Route
          path="collect"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CollectView />
            </Suspense>
          }
        >
          <Route
            path="add"
            element={
              <Suspense fallback={null}>
                <NewCollectForm />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="payment"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PaymentView />
            </Suspense>
          }
        >
          <Route
            path="add"
            element={
              <Suspense fallback={null}>
                <NewPaymentForm />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default CashflowReportRoutes;


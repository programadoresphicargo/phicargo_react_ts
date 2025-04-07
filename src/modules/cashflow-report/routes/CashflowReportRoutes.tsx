import { Suspense, lazy } from 'react';

import CashflowLayout from '../Layout/CashflowLayout';
import { LoadingPage } from '@/pages/LoadingPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import { Route } from 'react-router-dom';

const CollectView = lazy(() => import('../outlets/CollectView'));
const PaymentView = lazy(() => import('../outlets/PaymentView'));

const PERMISSION_ID = 197;

const CashflowReportRoutes = () => (
  <Route
    path="balance"
    element={
      <ProtectedRoute
        element={<CashflowLayout />}
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
);

export default CashflowReportRoutes;


import { ErrorBoundary } from '../utilities/error-boundary';
import { Navbar } from '@/components/ui';
import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

type MenuItemType = {
  name: string;
  path: string;
  exact?: boolean;
};

interface Props {
  pages: MenuItemType[];
  children: ReactNode;
}

const BaseLayout = ({ children, pages }: Props) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar pages={pages} />
      <main className="flex-grow w-full bg-slate-50">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default BaseLayout;


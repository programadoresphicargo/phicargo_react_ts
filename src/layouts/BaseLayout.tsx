import { ErrorBoundary } from '@/components/utils/ErrorBoundary';
import { MenuItemType } from '@/types';
import { Navbar } from '@/components/ui';
import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

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


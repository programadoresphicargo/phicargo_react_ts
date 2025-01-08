import { ErrorBoundary } from '../utilities/error-boundary';
import { Navbar } from '../components/ui/Navbar';
import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

type MenuItemType = {
  name: string;
  path: string;
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
      <main className="flex-grow w-full">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};

export default BaseLayout;

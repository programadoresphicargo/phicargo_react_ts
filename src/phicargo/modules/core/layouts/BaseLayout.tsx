import { ErrorBoundary } from "../utilities/error-boundary";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom"
import type { ReactNode } from "react"

type MenuItemType = {
  name: string;
  path: string;
};

interface Props {
  pages: MenuItemType[];
  children: ReactNode
}

const BaseLayout = ({children, pages}: Props) => {
  return (
    <>
      <Navbar pages={pages} />
      <main className="flex-grow w-full p-2">
        <ErrorBoundary>
          {children}
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  )
}

export default BaseLayout
import { ErrorBoundary } from "../../core/utilities/error-boundary"
import Navbar from "../components/ui/Navbar"
import { Outlet } from "react-router-dom"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const BaseLayout = ({children}: Props) => {
  return (
    <>
      <Navbar />
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
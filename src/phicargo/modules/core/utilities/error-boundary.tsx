import { Component, ErrorInfo, ReactNode } from 'react';

import { IoSadOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

/**
 * Componente que captura errores en la aplicación y muestra un mensaje de error
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-cente p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
            <IoSadOutline className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Ups... Algo salió mal
            </h1>
            <p className="text-gray-600 mb-6">
              Parece que ocurrió un error inesperado. Intenta recargar la página
              o volver al inicio.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
              <Link
                to="/"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
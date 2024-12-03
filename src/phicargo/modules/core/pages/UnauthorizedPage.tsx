import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {

  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <p className="mt-4 text-2xl font-semibold">Acceso no autorizado</p>
        <p className="mt-2 text-gray-600">
          No tienes permiso para ver esta página.
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-6 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;


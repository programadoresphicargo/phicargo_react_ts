import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-2xl font-semibold">Pagina No Encontrada</p>
        <p className="mt-2 text-gray-600">
          La pagina no existe o la URL es erronea.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-6 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;


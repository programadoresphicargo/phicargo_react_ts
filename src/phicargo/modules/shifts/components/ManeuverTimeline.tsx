export const ManeuverTimeline = () => {
  return (
    <>
      <h3 className="font-bold text-lg text-gray-800 mb-4">
        Últimas maniobras del operador
      </h3>
      <div className="space-y-6">

        <div className="relative pl-6">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="font-medium text-gray-700">Maniobra M-2095</p>
          <p className="text-sm text-gray-500">
            Inicio programado: 2024/11/09 04:00pm
          </p>
          <div className="mt-2 pl-4 border-l-2 border-gray-300">
            <p className="text-sm text-gray-600">Tipo: Ingreso</p>
            <p className="text-sm text-gray-600">Terminal: PATIO VERACRUZ</p>
            <p className="text-sm text-gray-600">Vehículo: C-0103</p>
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="font-medium text-gray-700">Maniobra M-2096</p>
          <p className="text-sm text-gray-500">
            Inicio programado: 2024/11/09 04:30pm
          </p>
          <div className="mt-2 pl-4 border-l-2 border-gray-300">
            <p className="text-sm text-gray-600">Tipo: Ingreso</p>
            <p className="text-sm text-gray-600">Terminal: PATIO VERACRUZ</p>
            <p className="text-sm text-gray-600">Vehículo: C-0104</p>
          </div>
        </div>

        
      </div>
    </>
  );
};


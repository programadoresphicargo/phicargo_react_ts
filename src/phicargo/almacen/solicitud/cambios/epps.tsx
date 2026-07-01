type Mail = {
  create_date: string;
  usuario: string;
  body: string;
  field_desc: string;
  old_value_char: string;
  new_value_char: string;
};

type HistorialCambiosProps = {
  data: Mail[];
};

const HistorialCambios = ({ data }: HistorialCambiosProps) => {

  return (
    <>
      <div className="space-y-4">
        {data.map((data, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            {/* Fecha */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                {new Date(data.create_date).toLocaleString()}
              </span>

              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {data.usuario}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-700 mb-2">
              {data.body}
            </p>

            {/* data */}
            <div className="text-sm">
              <span className="font-medium text-gray-600">
                {data.field_desc}
              </span>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                  {data.old_value_char
                    ? data.old_value_char.toUpperCase()
                    : "—"}
                </span>

                <span className="text-gray-400">→</span>

                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                  {data.new_value_char
                    ? data.new_value_char.toUpperCase()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HistorialCambios;

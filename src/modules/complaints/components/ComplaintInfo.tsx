import {
  FaBuilding,
  FaCalendarAlt,
  FaExclamationCircle,
  FaLightbulb,
  FaMapMarkerAlt,
} from 'react-icons/fa';

import type { Complaint } from '../models';

interface Props {
  complaint: Complaint;
}

export const ComplaintInfo = ({ complaint }: Props) => {
  return (
    <section className="px-2 space-y-3">
      <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <span className="bg-blue-100 p-1 rounded-full">📋</span>
        Detalles de la No Conformidad
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
          <FaExclamationCircle
            className="text-blue-500 mt-0.5 flex-shrink-0"
            size={14}
          />
          <div>
            <p className="text-xs font-medium text-gray-500">No Conformidad</p>
            <p className="text-sm text-gray-800">
              {complaint.complaintDescription}
            </p>
          </div>
        </div>

        {complaint.complaintSuggestion && (
          <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
            <FaLightbulb
              className="text-yellow-500 mt-0.5 flex-shrink-0"
              size={14}
            />
            <div>
              <p className="text-xs font-medium text-gray-500">Sugerencia</p>
              <p className="text-sm text-gray-800">
                {complaint.complaintSuggestion}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={12} />
            <div>
              <p className="text-xs font-medium text-gray-500">Fecha</p>
              <p className="text-xs text-gray-700">
                {complaint.complaintDate.format('DD/MM/YYYY')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaBuilding className="text-gray-400 flex-shrink-0" size={12} />
            <div>
              <p className="text-xs font-medium text-gray-500">Empresa</p>
              <p className="text-xs text-gray-700">
                {complaint.phicargoCompany}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" size={12} />
            <div>
              <p className="text-xs font-medium text-gray-500">Área</p>
              <p className="text-xs text-gray-700">{complaint.area}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

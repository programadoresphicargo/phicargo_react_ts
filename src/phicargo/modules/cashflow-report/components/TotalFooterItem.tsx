import { formatCurrency } from '../utils';

interface TotalFooterItemProps {
  total: number;
}

/**
 * Componente que muestra el total de una columna en un pie de tabla.
 */
const TotalFooterItem: React.FC<TotalFooterItemProps> = ({ total }) => {
  return (
    <div
      style={{
        padding: '5px',
        borderTop: '3px solid #ff5733', // Color de borde más vibrante
        backgroundColor: '#f0f8ff', // Color de fondo claro
        color: '#333', // Color del texto
        textAlign: 'left', // Alineación a la izquierda
        fontSize: '12px', // Tamaño de fuente mayor
        fontWeight: 'bold', // Peso de fuente negrita
      }}
    >
      <p style={{ margin: '0' }}>Total: {formatCurrency(total)}</p>
    </div>
  );
};

export default TotalFooterItem;

import { useAuthContext } from '../modules/auth/hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  icon: string;
  label: string;
  link: string;
  isExternal?: boolean;
}

const MenuItem = ({ icon, label, link, isExternal = false }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuthContext();

  const handleClick = () => {
    if (isExternal) {
      // Crear un formulario dinámico
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = link;
      form.target = '_blank';

      // Añadir una variable al formulario
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'id_usuario'; // Nombre del campo que deseas enviar
      input.value = String(session?.user.id); // Valor de la variable
      form.appendChild(input);

      // Enviar el formulario
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      navigate(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        flex
        flex-col
        items-center
        justify-center
        w-32
        h-32
        rounded-2xl
        bg-white
        shadow-md
        cursor-pointer
        transition-colors
        duration-200
        hover:bg-gray-100
      "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-20 h-20 mb-1.5" />
      </div>
      <div className="text-xs font-bold text-center">{label}</div>
    </div>
  );
};

export default MenuItem;


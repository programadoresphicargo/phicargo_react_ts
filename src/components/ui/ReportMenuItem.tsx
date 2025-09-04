import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
  icon: string;
  label: string;
  path: string;
}

const ReportMenuItem = ({ icon, label, path }: MenuItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
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
      bg-white/10
      shadow-xl
      backdrop-blur-lg
      border
      border-white/30
      cursor-pointer
      transition
      duration-300
      hover:bg-white/20
      hover:shadow-2xl
      "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-20 h-20 mb-1.5" />
      </div>
      <div className="text-xs font-bold text-white text-center">{label}</div>
    </div>
  );
};

export default ReportMenuItem;


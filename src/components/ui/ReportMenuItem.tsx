import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
  icon: string;
  label: string;
  path: string;
}

const ReportMenuItem = ({ icon, label, path}: MenuItemProps) => {
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
        m-2 
        rounded-2xl 
        bg-white 
        shadow-md 
        cursor-pointer 
        transition-colors
        duration-200
        hover:bg-gray-100
      "
    >
      <img src={icon} alt={label} className="w-16 h-16 mb-2" />
      <div className="text-xs font-bold text-center">{label}</div>
    </div>
  );
};

export default ReportMenuItem;


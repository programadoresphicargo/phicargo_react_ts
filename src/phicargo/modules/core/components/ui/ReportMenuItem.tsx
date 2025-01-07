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
      className="flex flex-col items-center justify-center w-48 h-48 m-2 rounded-2xl bg-white shadow-lg cursor-pointer transition-transform transform hover:scale-105"
    >
      <img src={icon} alt={label} className="w-36 h-36 mb-2" />
      <div className="text-sm font-bold text-center">{label}</div>
    </div>
  );
};

export default ReportMenuItem;


import { useNavigate } from 'react-router-dom';

interface Props {
  icon: string;
  label: string;
  link: string;
}

const MenuItem = ({ icon, label, link }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="
        flex 
        flex-col 
        items-center 
        justify-center 
        w-[150px] 
        h-[150px] 
        m-2.5 
        rounded-2xl 
        bg-white 
        shadow-md 
        cursor-pointer 
        transform 
        transition-transform 
        duration-200 
        hover:scale-105
      "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-[100px] h-[100px] mb-1.5" />
      </div>
      <div className="text-sm font-bold text-center">{label}</div>
    </div>
  );
};

export default MenuItem;


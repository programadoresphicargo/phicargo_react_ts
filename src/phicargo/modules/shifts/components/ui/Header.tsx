import { HeaderBase } from "@/phicargo/modules/core/components/ui/HeaderBase";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderBase onBack={() => navigate('/menu')} >
      <h1 className="text-2xl font-semibold">Shifts</h1>
    </HeaderBase>
  );
};


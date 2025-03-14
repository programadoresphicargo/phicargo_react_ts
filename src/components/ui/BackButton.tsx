import { Button, ButtonProps } from '@heroui/react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface Props extends ButtonProps {
  route: string;
}

export const BackButton = (props: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      isIconOnly
      aria-label="back"
      size="sm"
      onPress={() => navigate(props.route)}
      className="bg-gray-200/20 backdrop-blur-sm text-white rounded-full p-2 shadow-md transition"
      {...props}
    >
      <ArrowBackIcon />
    </Button>
  );
};


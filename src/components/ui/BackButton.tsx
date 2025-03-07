import { Button, ButtonProps, Link } from '@heroui/react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props extends ButtonProps {
  route: string;
}

export const BackButton = (props: Props) => {
  return (
    <Button
      isIconOnly
      aria-label="back"
      size="sm"
      as={Link}
      href={props.route}
      className="bg-gray-200/20 backdrop-blur-sm text-white rounded-full p-2 shadow-md transition"
      {...props}
    >
      <ArrowBackIcon />
    </Button>
  );
};


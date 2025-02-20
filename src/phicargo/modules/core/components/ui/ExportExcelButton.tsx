import { Button, ButtonProps } from "@heroui/react";

import { FaFileExcel } from 'react-icons/fa6';
import { ReactNode } from 'react';

interface ExportExcelButtonProps extends ButtonProps {
  label: ReactNode;
}

const ExportExcelButton = (props: ExportExcelButtonProps) => {
  return (
    <Button
      variant="faded"
      color="success"
      className="font-bold"
      startContent={<FaFileExcel width={'1.5em'} height={'1.5em'} />}
      {...props}
    >
      {props.label}
    </Button>
  );
};

export default ExportExcelButton;

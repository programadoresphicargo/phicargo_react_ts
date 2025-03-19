import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

import { FaFileExcel } from 'react-icons/fa6';

const ExportExcelButton = (props: IconButtonProps) => {
  return (
    <Tooltip arrow title="Exportar">
      <IconButton
        aria-label="export-to-excel"
        size="small"
        color="success"
        {...props}
      >
        <FaFileExcel />
      </IconButton>
    </Tooltip>
  );
};

export default ExportExcelButton;


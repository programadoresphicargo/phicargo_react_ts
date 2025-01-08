import { CSSProperties } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  onClick: () => void;
  customIcon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
}

export const RefreshButton = (props: Props) => {
  const { onClick, className, style, customIcon, buttonClassName } = props;

  return (
    <button onClick={onClick || (() => {})} className={className} style={style}>
      {customIcon || <RefreshIcon className={buttonClassName} />}
    </button>
  );
};


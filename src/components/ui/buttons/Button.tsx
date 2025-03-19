import { ButtonProps, Button as MUIButton, styled } from '@mui/material';

const CustomButton = styled(MUIButton)({
  borderRadius: '15px',
});

interface Props extends ButtonProps {
  children: string;
}

export const Button = (props: Props) => {
  return <CustomButton {...props}>{props.children}</CustomButton>;
};


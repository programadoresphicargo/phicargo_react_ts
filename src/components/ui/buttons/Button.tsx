import { ButtonProps, Button as MUIButton, styled } from '@mui/material';

const CustomButton = styled(MUIButton)({
  borderRadius: '15px',
});

interface Props extends ButtonProps {
  children: string;
}

export const Button = (props: Props) => {
  return (
    <CustomButton
      sx={{
        fontFamily: 'Inter',
      }}
      {...props}
    >
      {props.children}
    </CustomButton>
  );
};


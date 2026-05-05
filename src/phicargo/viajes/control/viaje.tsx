import { Dialog, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Viaje from "../viaje";
import { Button } from "@heroui/react";
import { ViajeProvider } from "../context/viajeContext";

type TravelProps = {
    idViaje: number;
    open: boolean;
    handleClose: () => void;
};

const Travel: React.FC<TravelProps> = ({
    idViaje,
    open,
    handleClose
}) => {

    return (
        <ViajeProvider>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar
                    elevation={0} position="static"
                    sx={{
                        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                    }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon sx={{ color: "white" }} />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
                        </Typography>
                        <Button autoFocus color="primary" onPress={handleClose} radius="full">
                            Salir
                        </Button>
                    </Toolbar>
                </AppBar>
                <Viaje idViaje={idViaje} />
            </Dialog>
        </ViajeProvider>
    );
};

export default Travel;

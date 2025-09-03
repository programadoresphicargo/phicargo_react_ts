import React, { useContext } from "react";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Viaje from "../viaje";
import { Button } from "@heroui/react";
import { styled } from '@mui/material/styles';
import { ViajeContext } from "../context/viajeContext";
import EstatusHistorialAgrupado from "../estatus/estatus_agrupados";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 650;

const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    marginRight: open ? `${drawerWidth}px` : 0,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
}));

const Travel = ({ open, handleClose }) => {

    const { drawerOpen, setDrawerOpen } = useContext(ViajeContext);

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
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
                    <Button autoFocus color="primary" onClick={handleClose}>
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="persistent"
                anchor="right"
                open={drawerOpen}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <EstatusHistorialAgrupado></EstatusHistorialAgrupado>
            </Drawer>

            <Main open={drawerOpen}>
                <Viaje />
            </Main>
        </Dialog>
    );
};

export default Travel;

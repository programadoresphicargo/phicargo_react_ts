import React from "react";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Viaje from "../viaje";
import { Button } from "@heroui/react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Travel = ({ open, handleClose }) => {
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
                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                    padding: '0 16px'
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
            <Viaje />
        </Dialog>
    );
};

export default Travel;

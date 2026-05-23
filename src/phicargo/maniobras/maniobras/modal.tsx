import Registromaniobras from './registros';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Contenedor } from '../tms_waybill/cartas_porte';

const RegistroManiobrasCP = ({ show, handleClose, data }: { show: boolean, handleClose: () => void, data: Contenedor }) => {
    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                fullWidth
                maxWidth="xl"
            >
                <AppBar
                    elevation={0}
                    position="static"
                    sx={{
                        background: 'linear-gradient(90deg, #0b2149, #002887)',
                        padding: '0 16px'
                    }}>
                    <Toolbar>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            ID: {data?.id_cp} Contenedor: {data?.x_reference} Cliente: {data?.id_cliente}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Registromaniobras
                        dataCP={data}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default RegistroManiobrasCP;
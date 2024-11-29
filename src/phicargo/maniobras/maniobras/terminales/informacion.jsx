import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function FormularioTerminales({ open, onClose, id_terminal }) {

    const [formData, setFormData] = useState({
        id_terminal: id_terminal,
        terminal: '',
    });

    useEffect(() => {
        const fetchVehiculoData = async () => {
            try {
                const response = await axios.get('/phicargo/modulo_maniobras/terminales/getTerminal.php?id_terminal=' + id_terminal);
                const data = response.data[0];
                setFormData(prevState => ({
                    ...prevState,
                    id_terminal: id_terminal,
                    terminal: data.terminal,
                }));
            } catch (error) {
                console.error("Error al obtener los datos del terminal:", error);
            }
        };

        if (id_terminal !== 0) {
            fetchVehiculoData();
        }
    }, [id_terminal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const actualizar = () => {
        console.log(formData);
        axios.post('/phicargo/modulo_maniobras/terminales/actualizar_terminal.php', formData)
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const registrar = () => {
        console.log(formData);
        axios.post('/phicargo/modulo_maniobras/terminales/registrar_terminal.php', formData)
            .then(response => {
                var data = response.data;
                if (data.success) {
                    toast.success('Terminal registrada');
                } else {
                    toast.error(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}
                fullWidth="lg"
                maxWidth="lg">
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        <form id="formpostura">
                            <div className="col-4 mb-3 mt-3">
                                <button type="button" className="btn btn-success btn-sm" onClick={registrar}>Guardar</button>
                            </div>

                            <div className="row">
                                <div className="col-3 mb-3">
                                    <label className="form-label">Terminal</label>
                                    <input type="text" className="form-control" id="terminal" name="terminal" value={formData.terminal} onChange={handleInputChange} />
                                </div>
                            </div>
                        </form>

                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormularioTerminales;

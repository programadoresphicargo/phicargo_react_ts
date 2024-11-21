import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

function PaginaConDialog({ open, onClose, id, name }) {

    const [formData, setFormData] = useState({
        id_vehiculo: id,
        company_id: '1',
        x_sucursal: '1',
        state_id: '0',
        x_operador_asignado: '',
        x_tipo_vehiculo: 'local',
        x_modalidad: 'sencillo',
        x_tipo_carga: 'general',
    });

    const [formPostura, setData] = useState({
        id_vehiculo: id,
        id_operador: '0',
        motivo: '0',
    });

    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        // Hacer la solicitud con Axios
        axios.get('/phicargo/reportes/unidades/historial_posturas.php?id_vehiculo=' + id)
            .then(response => {
                // Guardar el contenido HTML de la respuesta en el estado
                setHtmlContent(response.data);
            })
            .catch(error => {
                console.error('Error fetching the HTML:', error);
            });
    }, [id]);

    useEffect(() => {
        // Función para obtener datos del vehículo
        const fetchVehiculoData = async () => {
            try {
                const response = await axios.get(`/phicargo/reportes/unidades/getVehiculo.php?id=${id}`); // Reemplaza con la URL de tu API
                const data = response.data[0];
                console.log('----');
                console.log(data.company_id[0]);

                setData(prevState => ({
                    ...prevState,
                    id_vehiculo: id,
                }));

                // Actualiza el estado del formulario con los datos obtenidos
                setFormData(prevState => ({
                    ...prevState,
                    id_vehiculo: id,
                    company_id: data.company_id[0] || 1, // Valor por defecto si no existe
                    x_sucursal: data.x_sucursal[0] || 1, // Valor por defecto si no existe
                    state_id: data.state_id[0] || 0, // Valor por defecto si no existe
                    x_operador_asignado: data.x_operador_asignado[0] || 620, // Valor por defecto si no existe
                    x_tipo_vehiculo: data.x_tipo_vehiculo || 'local', // Valor por defecto si no existe
                    x_modalidad: data.x_modalidad || 'sencillo', // Valor por defecto si no existe
                    x_tipo_carga: data.x_tipo_carga || 'general', // Valor por defecto si no existe
                }));
            } catch (error) {
                console.error("Error al obtener los datos del vehículo:", error);
            }
        };

        fetchVehiculoData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setData({
            ...formPostura,
            [name]: value
        });
    };

    const [operadores, setOperadores] = useState([]);
    const [selectedOperador, setSelectedOperador] = useState('');

    const operadorOptions = [
        { value: false, label: 'N/A' },
        ...operadores.map(op => ({ value: op.id, label: op.name }))
    ];

    const handleSelectChange = (selectedOption) => {
        handleInputChange({ target: { name: "x_operador_asignado", value: selectedOption ? selectedOption.value : false } });
    };

    useEffect(() => {
        const fetchOperadores = async () => {
            try {
                const response = await axios.get('/phicargo/reportes/unidades/getOperadores.php'); // Reemplaza con la URL de tu API
                setOperadores(response.data);
            } catch (error) {
                console.error("Error al obtener los operadores:", error);
            }
        };
        fetchOperadores();
    }, []);

    const actualizar = () => {
        console.log(formData);
        axios.post('/phicargo/reportes/unidades/guardar_vehiculo.php', formData)
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
                if (response.data == 1) {
                    toast.success('Informacion actualizada');
                    onClose();
                } else {
                    toast.error('Error' + response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const guardarPostura = () => {
        console.log("Postura registrada");
        console.log(formData);
        axios.post('/phicargo/reportes/unidades/guardar_postura.php', formPostura)
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <form id="formpostura">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Datos del vehiculo</button>
                        <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Posturas</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">

                        <div className="col-4 mb-3 mt-3">
                            <button type="button" className="btn btn-primary btn-sm" onClick={actualizar}>Actualizar información</button>
                        </div>

                        <div className="mb-3">
                            <input type="hidden" className="form-control" id="id_vehiculo" name="id_vehiculo" />
                        </div>

                        <div className="row">

                            <div className="col-4 mb-3">
                                <label className="form-label">Empresa</label>
                                <select className="form-select" id="company_id" name="company_id" value={formData.company_id} onChange={handleInputChange}>
                                    <option value="1">TRANSPORTES BELCHEZ</option>
                                    <option value="2">PHI-CARGO</option>
                                </select>
                            </div>

                            <div className="col-4 mb-3">
                                <label className="form-label">Sucursal</label>
                                <select className="form-select" id="x_sucursal" name="x_sucursal" value={formData.x_sucursal} onChange={handleInputChange}>
                                    <option value="1">Veracruz</option>
                                    <option value="9">Manzanillo</option>
                                    <option value="2">México</option>
                                </select>
                            </div>

                            <div className="col-4 mb-3">
                                <label className="form-label">Estado</label>
                                <select className="form-select" id="state_id" name="state_id" value={formData.state_id} onChange={handleInputChange} disabled={formData.state_id === 4 || formData.state_id === 5}>
                                    <option value="1">EN USO</option>
                                    <option value="2">BAJA POR VENTA</option>
                                    <option value="3">BAJA POR PERDIDA TOTAL</option>
                                    <option value="4" disabled>EN REPARACION POR SINIESTRO</option>
                                    <option value="5" disabled>EN REPARACIÓN POR FALLAS MECÁNICAS</option>
                                    <option value="6">ESTATUS PGJ</option>
                                    <option value="7">ESTATUS OCRA</option>
                                    <option value="8">TERMINACIÓN DE ARRENDAMIENTO</option>
                                </select>
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label">Operador asignado</label>
                                <Select
                                    id="x_operador_asignado"
                                    name="x_operador_asignado"
                                    value={operadorOptions.find(option => option.value === formData.x_operador_asignado)}
                                    onChange={handleSelectChange}
                                    options={operadorOptions}
                                    placeholder="Select an operator"
                                    isClearable
                                />
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label">Tipo de vehiculo</label>
                                <select className="form-select" id="x_tipo_vehiculo" name="x_tipo_vehiculo" value={formData.x_tipo_vehiculo} onChange={handleInputChange}>
                                    <option value="local">Local</option>
                                    <option value="carretera">Carretera</option>
                                </select>
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label">Modalidad</label>
                                <select className="form-select" id="x_modalidad" name="x_modalidad" value={formData.x_modalidad} onChange={handleInputChange}>
                                    <option value="sencillo">Sencillo</option>
                                    <option value="full">Full</option>
                                </select>
                            </div>

                            <div className="col-6 mb-3">
                                <label className="form-label">Tipo de carga</label>
                                <select className="form-select" id="x_tipo_carga" name="x_tipo_carga" value={formData.x_tipo_carga} onChange={handleInputChange}>
                                    <option value="imo">IMO</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        <div className="row mt-3">
                            <div className="col-5">
                                <div className="mb-3">
                                    <label className="form-label">Operador postura</label>
                                    <select className="form-select" id="id_operador" name="id_operador" value={formPostura.id_operador} onChange={handleInputChange2}>
                                        {operadores.map((op) => (
                                            <option key={op.id} value={op.id}>{op.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Motivo de postura</label>
                                    <input type="text" className="form-control" id="motivo" name="motivo" value={formPostura.motivo} onChange={handleInputChange2} />
                                </div>
                            </div>
                            <div className="col-7">
                                <div id="historial_posturas">
                                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-danger" onClick={guardarPostura}>Registrar postura</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaginaConDialog;

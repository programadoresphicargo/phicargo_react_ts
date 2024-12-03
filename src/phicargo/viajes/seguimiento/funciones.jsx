import React, { useState, useEffect, useMemo, useContext } from 'react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { ViajeContext } from '../context/viajeContext';
import axios from "axios";
import { useAuthContext } from '../../modules/auth/hooks';
const { VITE_PHIDES_API_URL } = import.meta.env;

export const useJourneyDialogs = () => {

    const { session } = useAuthContext();
    const { id_viaje, getHistorialEstatus, getViaje } = useContext(ViajeContext);

    const iniciar_viaje = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas inciar este viaje?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, iniciar viaje',
            cancelButtonText: 'Cancelar',
            imageUrl: VITE_PHIDES_API_URL + '/img/status/start.png',
            imageWidth: 150,
            imageHeight: 150,
            imageAlt: 'Imagen de confirmación',
        }).then((result) => {
            if (result.isConfirmed) {
                enviar_estatus(id_viaje, 1, [], '');
            }
        });
    };

    const finalizar_viaje = () => {
        Swal.fire({
            title: '¿Realmente quieres finalizar este viaje?',
            text: 'Esta acción no se puede deshacer',
            imageUrl: VITE_PHIDES_API_URL + '/img/status/final.gif',
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Imagen',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, finalizar viaje',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                enviar_estatus(id_viaje, 103, [], '');
            }
        });
    };

    const liberar_resguardo = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Realmente deseas liberar el resguardo de esta unidad? Los status automáticos se reactivarán.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, liberar resguardo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviar_estatus(id_viaje, 17, [], '');
            }
        });
    };

    const reactivar_viaje = () => {
        Swal.fire({
            title: '¿Realmente quieres reactivar este viaje?',
            text: 'Esta acción no se puede deshacer',
            imageUrl: VITE_PHIDES_API_URL + '/img/status/final.gif',
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Imagen',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, reactivar viaje',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Reactivando viaje, espere...');

                const data = new URLSearchParams();
                data.append('id_viaje', id_viaje);

                axios.post(VITE_PHIDES_API_URL + '/viajes/funciones/reactivarViaje.php', data)
                    .then(response => {
                        if (response.data === 1) {
                            toast.success('Viaje reactivado.', { id: loadingToast });
                            getViaje(id_viaje);
                        } else {
                            toast.error('Error activando el viaje: ' + response.data, { id: loadingToast });
                        }
                    })
                    .catch(error => {
                        toast.error('Error activando el viaje: ' + error, { id: loadingToast });
                    });
            }
        });
    };

    const enviar_estatus = async (id_viaje, id_estatus, archivos, comentarios) => {
        const loadingToast = toast.loading('Procesando, espere...');

        try {
            const data = new FormData();
            data.append('id_viaje', id_viaje);
            data.append('id_estatus', id_estatus);
            data.append('comentarios', comentarios);
            data.append('id_usuario', session.user.id);
            archivos.forEach((file) => {
                data.append('files[]', file);
            });

            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/algoritmos/envio_manual.php', data);

            if (response.data === 1) {
                toast.success('Proceso correcto.', { id: loadingToast });
                getHistorialEstatus();
                getViaje(id_viaje);
                if (id_estatus == 1) {
                    cambiar_estado_equipo('viaje');
                } else if (id_estatus == 103) {
                    cambiar_estado_equipo('disponible');
                }

            } else {
                toast.error('Error: ' + response.data, { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error: ' + error, { id: loadingToast });
        }
    };

    const reenviar_estatus = async (id_viaje, id_reporte, id_estatus, archivos, comentarios) => {
        const loadingToast = toast.loading('Procesando, espere...');

        try {
            const data = new URLSearchParams();
            data.append('id_viaje', id_viaje);
            data.append('id_reporte', id_reporte);
            data.append('id_estatus', id_estatus);
            data.append('comentarios', comentarios);
            data.append('id_usuario', session.user.id);
            archivos.forEach((file) => {
                data.append('files[]', file);
            });

            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/algoritmos/reenvio.php', data);

            if (response.data === 1) {
                toast.success('Proceso correcto.', { id: loadingToast });
                getHistorialEstatus();
                getViaje(id_viaje);
                if (id_estatus == 1) {
                    cambiar_estado_equipo('viaje');
                } else if (id_estatus == 103) {
                    cambiar_estado_equipo('disponible');
                }

            } else {
                toast.error('Error: ' + response.data, { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error: ' + error, { id: loadingToast });
        }
    };

    const comprobar_operador = async () => {
        try {
            const data = new URLSearchParams();
            data.append('id_viaje', id_viaje);

            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/funciones/comprobarOperador.php', data);

            if (response.data === 1) {
                return true;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El nombre del conductor de este viaje no concuerda con el operador programado en las cartas porte ligadas. Favor de actualizar los campos "Conductor en viaje" y "Operador Prog en carta porte" e intente nuevamente.',
                });
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    const comprobar_disponibilidad = async () => {
        try {
            const data = new URLSearchParams();
            data.append('id_viaje', id_viaje);

            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/disponibilidad/comprobar_disponibilidad.php', data);

            const datos = response.data;
            if (Array.isArray(datos) && datos.length > 0) {
                let mensajesEquipos = '';

                datos.forEach((item) => {
                    const mensaje = 'Equipo: ' + item.equipo + ' en ' + item.estado + ' : ' + item.referencia;
                    mensajesEquipos += mensaje + '<br>';
                });

                Swal.fire({
                    icon: "error",
                    title: "No se puede iniciar esta viaje, equipos no disponibles.",
                    html: "El equipo asignado para esta viaje está actualmente en uso. Para activar una nueva maniobra o viaje, primero debes finalizar la maniobra o viaje anterior: <br><br>" + mensajesEquipos,
                });

            } else {
                iniciar_viaje();
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    const cambiar_estado_equipo = async (estado) => {
        try {
            const data = new URLSearchParams();
            data.append('id_viaje', id_viaje);
            data.append('estado', estado);
            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/disponibilidad/cambiar_estados.php', data);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    return {
        iniciar_viaje,
        finalizar_viaje,
        liberar_resguardo,
        reactivar_viaje,
        enviar_estatus,
        reenviar_estatus,
        comprobar_operador,
        comprobar_disponibilidad,
    };
};

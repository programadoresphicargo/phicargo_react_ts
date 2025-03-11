import React, { useState, useEffect, useMemo, useContext } from 'react';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { ViajeContext } from '../context/viajeContext';
import axios from "axios";
import { useAuthContext } from '../../modules/auth/hooks';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
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

                odooApi.get('/tms_travel/reactivar_viaje/' + id_viaje)
                    .then(response => {
                        if (response.data.status === "success") {
                            toast.success(response.data.message, { id: loadingToast });
                            getViaje(id_viaje);
                        } else {
                            toast.error('Error activando el viaje: ' + response.data.message, { id: loadingToast });
                        }
                    })
                    .catch(error => {
                        toast.error('Error activando el viaje: ' + error, { id: loadingToast });
                    });
            }
        });
    };

    const enviar_estatus = async (id_viaje, id_estatus, archivos, comentarios, nueva_fecha = null) => {
        const loadingToast = toast.loading('Procesando, espere...');

        try {
            const data = new FormData();
            data.append('id_viaje', id_viaje);
            data.append('id_estatus', id_estatus);
            data.append('comentarios', comentarios);
            data.append('id_usuario', session.user.id);

            if (nueva_fecha) {
                data.append('nueva_fecha', nueva_fecha);
            }

            archivos.forEach((file) => {
                data.append('files[]', file);
            });

            const response = await axios.post(VITE_PHIDES_API_URL + '/viajes/algoritmos/envio_manual.php', data);

            if (response.data === 1) {
                toast.success('Proceso correcto.', { id: loadingToast });
                getViaje(id_viaje);

                if (id_estatus == 1) {
                    cambiar_estado_equipo('viaje');
                    cambiar_estado_operador('viaje');
                } else if (id_estatus == 103) {
                    cambiar_estado_equipo('disponible');
                    cambiar_estado_operador('disponible');
                } else if (id_estatus == 8) {
                    calcular_estadia(id_viaje);
                }
                return true;
            } else {
                toast.error('Error: ' + response.data, { id: loadingToast, duration: 10000 });
                return false;
            }
        } catch (error) {
            toast.error('Error catch: ' + (error.message || error.toString()), { id: loadingToast });
            return false;
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
                getViaje(id_viaje);

            } else {
                toast.error('Error: ' + response.data, { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error: ' + error, { id: loadingToast });
        }
    };

    const comprobar_operador = async () => {
        try {
            const response = await odooApi.get('/tms_travel/comprobar_operador_viaje/' + id_viaje);
            if (response.data.status === 'success') {
                return true;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message,
                });
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    const comprobar_horarios = async () => {
        try {
            const res = await odooApi.get('/tms_travel/get_by_id/' + id_viaje);
            if (res.data[0].x_status_viaje == null || res.data[0].x_status_viaje == 'disponible') {

                const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);

                if (Array.isArray(response.data)) {
                    const viajes = response.data;

                    let errores = [];

                    viajes.forEach((viaje) => {
                        if (!viaje.date_start || !viaje.x_date_arrival_shed) {
                            errores.push(`Carta porte ${viaje.name} tiene fechas inválidas o vacías.`);
                            return;
                        }

                        let dateStart = new Date(viaje.date_start.replace(" ", "T"));
                        let dateArrival = new Date(viaje.x_date_arrival_shed.replace(" ", "T"));

                        if (isNaN(dateStart.getTime()) || isNaN(dateArrival.getTime())) {
                            errores.push(`Carta porte ${viaje.name} tiene fechas con formato inválido.`);
                            return;
                        }

                        dateStart.setHours(dateStart.getHours() - 6);
                        dateArrival.setHours(dateArrival.getHours() - 6);

                        const now = new Date();

                        if (dateStart <= now) {
                            errores.push(`El inicio de ruta en ${viaje.name} debe ser en el futuro.`);
                        }
                        if (dateArrival <= now) {
                            errores.push(`La llegada a planta en ${viaje.name} debe ser en el futuro.`);
                        }
                        if (dateStart >= dateArrival) {
                            errores.push(`La llegada a planta debe ser después del inicio de ruta en ${viaje.name}.`);
                        }
                    });

                    if (errores.length > 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Errores en los horarios de inicio de ruta programado y/o llegada a planta programada',
                            html: errores.join('<br>'),
                        });
                        return false;
                    }

                    return true;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la respuesta',
                        text: 'No se encontraron viajes o la estructura de datos no es válida.',
                    });
                    return false;
                }
            } else {
                return true;
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const comprobar_disponibilidad = async () => {
        try {
            const response = await odooApi.get('/tms_travel/comprobar_disponibilidad_equipo/' + id_viaje);
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
            toast.error('Error catch' + error);
            throw error;
        }
    };

    const cambiar_estado_equipo = async (estado) => {
        try {
            const response = await odooApi.get(`/tms_travel/cambiar_estado_equipo/${id_viaje}/${estado}`);
            if (response.data.success) {
                toast.success(response.data.message, { duration: 10000, });
            } else {
                toast.error(response.data.message, { duration: 10000, });
            }

        } catch (error) {
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    const cambiar_estado_operador = async (estado) => {
        try {
            const response = await odooApi(`/tms_travel/cambiar_estado_operador/${id_viaje}/${estado}`);
            if (response.data.success) {
                toast.success(response.data.message, { duration: 10000, });
            } else {
                toast.error(response.data.message, { duration: 10000, });
            }

        } catch (error) {
            toast.error('Error activando el viaje');
            throw error;
        }
    };

    const calcular_estadia = async (id_viaje) => {
        try {
            const response = await odooApi.get('/tms_travel/calcular_estadia/', {
                params: { travel_id: id_viaje },
            });
            const data = response.data;

            if (Array.isArray(data.folios_creados) && data.folios_creados.length > 0) {
                const folio = data.folios_creados[0];
                toast.success(`Viaje genera estadías,  ${folio.mensaje} (ID: ${folio.id_folio})`, { duration: 10000, });
            }

            if (Array.isArray(data.viajes_sin_estadia) && data.viajes_sin_estadia.length > 0) {
                toast.success("Viaje no genera estadías", { duration: 10000, });
            }

        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || "❌ Error al procesar la solicitud.";
            toast.error(errorMessage);
            console.error("Error en calcular_estadia:", error);
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
        comprobar_horarios
    };
};

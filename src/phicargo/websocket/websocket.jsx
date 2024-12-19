import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import audioFile from '../../assets/audio/estatus_operador.mp3'; // Ruta relativa a la ubicación del archivo

const WebSocketWithToast = () => {
    const webSocketRef = useRef(null);
    const audioRef = useRef(null);  // Ref para el audio
    const [selectedVoice, setSelectedVoice] = useState(null);

    // Función para sintetizar el habla con la voz seleccionada
    const speakMessage = (message) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(message);

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("La API SpeechSynthesis no es compatible con este navegador.");
        }
    };

    // Cargar voces disponibles y seleccionar la deseada
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const desiredVoice = voices.find(
            (voice) => voice.name === "Microsoft Laura" // Cambiar aquí a la voz deseada
        );

        if (desiredVoice) {
            setSelectedVoice(desiredVoice);
            console.log(`Voz seleccionada: ${desiredVoice.name}`);
        } else {
            console.log("No se encontró la voz deseada.");
        }
    };

    // Función para mostrar notificación push
    const showPushNotification = (title, body) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: "/icon.png" // Cambia la ruta del icono según lo que prefieras
            });
        } else if (Notification.permission !== "granted") {
            // Solicitar permisos para mostrar notificaciones
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(title, { body: body, icon: "/icon.png" });
                }
            });
        }
    };

    useEffect(() => {
        // Asegurarse de que las voces estén disponibles
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        const webSocket = new WebSocket("wss://websocket.phicargo-sistemas.online/ws");
        webSocketRef.current = webSocket;

        // Evento cuando el WebSocket se conecta
        webSocket.onopen = () => {
            const message = "Conectado al servidor WebSocket";
            toast.info(message, { autoClose: 3000 });
            speakMessage(message);
            showPushNotification("Conexión WebSocket", message); // Notificación push
        };

        // Evento cuando llega un mensaje
        webSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const message = data.message || "Nuevo mensaje recibido";
                toast.success(`Notificación: ${message}`, { autoClose: 5000 });
                speakMessage(message);
                showPushNotification("Nuevo mensaje", message); // Notificación push

                // Reproducir el archivo MP3 local cuando llegue un mensaje
                if (audioRef.current) {
                    audioRef.current.play(); // Reproducir el audio
                }
            } catch {
                const message = `Mensaje recibido: ${event.data}`;
                toast.info(message, { autoClose: 5000 });
                speakMessage(message);
                showPushNotification("Mensaje recibido", message); // Notificación push

                // Reproducir el archivo MP3 local cuando llegue un mensaje
                if (audioRef.current) {
                    audioRef.current.play(); // Reproducir el audio
                }
            }
        };

        // Evento cuando ocurre un error
        webSocket.onerror = () => {
            const message = "Error en la conexión WebSocket";
            toast.error(message, { autoClose: 3000 });
            speakMessage(message);
            showPushNotification("Error WebSocket", message); // Notificación push
        };

        // Evento cuando se cierra la conexión
        webSocket.onclose = () => {
            const message = "Conexión WebSocket cerrada";
            toast.warning(message, { autoClose: 3000 });
            speakMessage(message);
            showPushNotification("Conexión cerrada", message); // Notificación push
        };

        return () => {
            webSocket.close();
        };
    }, [selectedVoice]);

    return (
        <div>
            {/* Elemento audio con un archivo MP3 importado */}
            <audio ref={audioRef} src={audioFile} hidden /> {/* Reemplaza la ruta con la de tu archivo MP3 */}
        </div>
    );
};

export default WebSocketWithToast;

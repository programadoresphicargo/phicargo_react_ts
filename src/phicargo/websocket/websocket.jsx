import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import audioFile from '../../assets/audio/estatus_operador.mp3';
import { useAuthContext } from "../modules/auth/hooks";
import { user } from "@nextui-org/react";
const { VITE_WEBSOCKET_SERVER } = import.meta.env;

const WebSocketWithToast = () => {
    const { session } = useAuthContext();
    const webSocketRef = useRef(null);
    const audioRef = useRef(null);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const speakMessage = (message) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            //window.speechSynthesis.speak(utterance);
        } else {
            console.warn("La API SpeechSynthesis no es compatible con este navegador.");
        }
    };

    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const desiredVoice = voices.find((voice) => voice.name === "Microsoft Laura");
        if (desiredVoice) {
            setSelectedVoice(desiredVoice);
            console.log(`Voz seleccionada: ${desiredVoice.name}`);
        } else {
            console.log("No se encontró la voz deseada.");
        }
    };

    const showPushNotification = (title, body) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body, icon: "/icon.png" });
        } else if (Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(title, { body, icon: "/icon.png" });
                }
            });
        }
    };

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        const webSocket = new WebSocket(VITE_WEBSOCKET_SERVER + session.user.id);
        webSocketRef.current = webSocket;

        webSocket.onopen = () => {
            const message = "Conectado al servidor WebSocket";
            toast.info(message, { autoClose: 3000 });
            speakMessage(message);
            console.log("Conexión WebSocket", message);
        };

        webSocket.onmessage = (event) => {
            try {
                const data = event.data;
                console.log(data);

                // Manejar mensajes de tipo 'ping' o 'pong'
                if (data.type === 'ping') {
                    console.log(`Mensaje ${data.type} recibido del servidor.`);
                    return; // Ignorar el mensaje si es una respuesta al ping
                }

                // Procesar otros mensajes
                const message = data.message || "Nuevo mensaje recibido";
                toast.success(`Notificación: ${data}`, { autoClose: 5000 });
                //speakMessage(message);
                showPushNotification("Nuevo mensaje: " + data);

                if (audioRef.current) {
                    audioRef.current.play();
                }
            } catch (error) {
                console.error("Error al procesar el mensaje:", error);
            }
        };

        webSocket.onerror = () => {
            const message = "Error en la conexión WebSocket";
            console.log(message, { autoClose: 3000 });
            speakMessage(message);
            console.log("Error WebSocket", message);
        };

        webSocket.onclose = () => {
            const message = "Conexión WebSocket cerrada";
            console.log(message, { autoClose: 3000 });
            speakMessage(message);
            console.log("Conexión cerrada", message);
        };

        return () => {
            webSocket.close();
        };
    }, [selectedVoice]);

    return (
        <div>
            <audio ref={audioRef} src={audioFile} hidden />
        </div>
    );
};

export default WebSocketWithToast;

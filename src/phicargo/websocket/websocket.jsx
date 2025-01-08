import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import audioFile from '../../assets/audio/estatus_operador.mp3';

const WebSocketWithToast = () => {
    const webSocketRef = useRef(null);
    const audioRef = useRef(null);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const pingIntervalRef = useRef(null); // Ref para el intervalo de ping

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

        const webSocket = new WebSocket("wss://websocket.phicargo-sistemas.online/ws");
        webSocketRef.current = webSocket;

        webSocket.onopen = () => {
            const message = "Conectado al servidor WebSocket";
            toast.info(message, { autoClose: 3000 });
            speakMessage(message);
            showPushNotification("Conexión WebSocket", message);

            // Iniciar envío de pings cada 30 segundos
            pingIntervalRef.current = setInterval(() => {
                if (webSocket.readyState === WebSocket.OPEN) {
                    webSocket.send(JSON.stringify({ type: "ping" })); // Mensaje de ping
                    console.log("Ping enviado al servidor.");
                }
            }, 30000); // 30 segundos
        };

        webSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Manejar mensajes de tipo 'ping' o 'pong'
                if (data.type === "pong" || data.type === 'ping') {
                    console.log(`Mensaje ${data.type} recibido del servidor.`);
                    return; // Ignorar el mensaje si es una respuesta al ping
                }

                // Procesar otros mensajes
                const message = data.message || "Nuevo mensaje recibido";
                toast.success(`Notificación: ${message}`, { autoClose: 5000 });
                speakMessage(message);
                showPushNotification("Nuevo mensaje", message);

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
            showPushNotification("Error WebSocket", message);
        };

        webSocket.onclose = () => {
            const message = "Conexión WebSocket cerrada";
            console.log(message, { autoClose: 3000 });
            speakMessage(message);
            showPushNotification("Conexión cerrada", message);

            // Limpiar el intervalo de ping
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };

        return () => {
            webSocket.close();
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };
    }, [selectedVoice]);

    return (
        <div>
            <audio ref={audioRef} src={audioFile} hidden />
        </div>
    );
};

export default WebSocketWithToast;

import { useEffect, useRef, useState } from "react";
import { addToast } from "@heroui/react";
import audioDetenciones from '../../assets/audio/detencion.mp3';
import audioFile from '../../assets/audio/estatus_operador.mp3';
import { useAuthContext } from "@/modules/auth/hooks";
const { VITE_WEBSOCKET_SERVER } = import.meta.env;

const WebSocketWithToast = () => {
    const { session } = useAuthContext();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioDet = useRef<HTMLAudioElement | null>(null);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const speakMessage = (message: string) => {
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

    const showPushNotification = (title: string, body: string) => {

        if (!("Notification" in window)) {
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body, icon: "/icon.png" });
        } else {
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

        const webSocket = new WebSocket(VITE_WEBSOCKET_SERVER + session?.user.id);

        webSocket.onopen = () => {
            const message = "Conectado al servidor WebSocket";
            addToast({
                title: message,
                color: 'primary',
                variant: 'solid'
            });
            speakMessage(message);
            console.log("Conexión WebSocket", message);
        };

        webSocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data);
                const messageType = data.type || "Desconocido";
                const message = data.message || "Nuevo mensaje recibido";

                if (messageType === "ping") {
                    console.log(`Mensaje ${messageType} recibido del servidor.`);
                    return;
                }

                console.log(messageType);
                if (messageType === 'detencion') {
                    addToast({
                        title: message,
                        color: 'danger',
                        variant: 'solid'
                    });
                    //showPushNotification(`Nueva alerta: ${message}`);
                    if (audioDet.current) {
                        audioDet.current.play();
                    }
                    //speakMessage(message);
                    return;
                } else {
                    addToast({
                        title: message,
                        color: 'success',
                        variant: 'solid'
                    });
                    //speakMessage(message);
                    showPushNotification(`Nueva alerta: ${message}`, `Nueva alerta: ${message}`);
                }

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
    }, [session?.user?.id]);

    return (
        <div>
            <audio ref={audioRef} src={audioFile} hidden />
            <audio ref={audioDet} src={audioDetenciones} hidden />
        </div>
    );
};

export default WebSocketWithToast;

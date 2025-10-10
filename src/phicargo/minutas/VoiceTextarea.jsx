import { Button, Divider, Select, Textarea } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";

const VoiceTextarea = ({
 value,
 onChange,
 label = "Texto",
 isDisabled = false,
 isInvalid = false,
 errorMessage = "",
 lang = "es-MX", // idioma del reconocimiento
}) => {
 const recognitionRef = useRef(null);
 const [listening, setListening] = useState(false);
 const [interimText, setInterimText] = useState(""); // para resultados parciales

 useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
   console.warn("Tu navegador no soporta SpeechRecognition");
   return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onresult = (event) => {
   let finalTranscript = "";
   let interimTranscript = "";

   for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) finalTranscript += transcript + " ";
    else interimTranscript += transcript;
   }

   // Concatenamos el texto final al existente
   if (finalTranscript) {
    onChange(value + finalTranscript);
   }

   // Mostramos texto parcial mientras habla
   setInterimText(interimTranscript);
  };

  recognitionRef.current = recognition;
 }, [onChange, value, lang]);

 const toggleListening = () => {
  if (!recognitionRef.current) return;

  if (listening) {
   recognitionRef.current.stop();
   setListening(false);
   setInterimText(""); // limpiar texto parcial
  } else {
   recognitionRef.current.start();
   setListening(true);
  }
 };

 return (
  <div style={{ position: "relative", width: "100%", gap: "12px", }}>
   <Button
    onPress={toggleListening}
    color={listening ? "danger" : "primary"}
    isDisabled={isDisabled}
    radius="full"
    className="mb-2">
    {listening ? "⏹ Detener" : "🎤 Hablar"}
   </Button>
   <Textarea
    variant="bordered"
    label={label}
    value={value + interimText}
    isDisabled={isDisabled}
    onChange={(e) => onChange(e.target.value)}
    isInvalid={isInvalid}
    errorMessage={errorMessage}
   />
  </div>
 );
};

export default VoiceTextarea;

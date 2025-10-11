import { Button, Textarea } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";

const VoiceTextarea = ({
 value = "",
 name,
 onChange,
 label = "Texto",
 isDisabled = false,
 isInvalid = false,
 errorMessage = "",
 lang = "es-MX",
}) => {
 const recognitionRef = useRef(null);
 const [listening, setListening] = useState(false);
 const [interimText, setInterimText] = useState("");
 const [finalText, setFinalText] = useState(value); // Guarda todo lo reconocido

 useEffect(() => {
  const SpeechRecognition =
   window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
   console.warn("Tu navegador no soporta SpeechRecognition");
   return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onresult = (event) => {
   let newFinalTranscript = "";
   let newInterimTranscript = "";

   for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) newFinalTranscript += transcript + " ";
    else newInterimTranscript += transcript;
   }

   // Acumula todo el texto final
   if (newFinalTranscript) {
    setFinalText((prev) => {
     const updated = prev + newFinalTranscript;
     onChange(name, updated); // actualiza el valor externo
     return updated;
    });
   }

   setInterimText(newInterimTranscript);
  };

  recognition.onend = () => {
   if (listening) recognition.start(); // reinicia si estaba escuchando
  };

  recognitionRef.current = recognition;
 }, [lang, listening, name, onChange]);

 const toggleListening = () => {
  if (!recognitionRef.current) return;

  if (listening) {
   recognitionRef.current.stop();
   setListening(false);
   setInterimText(""); // limpia solo el texto parcial
  } else {
   recognitionRef.current.start();
   setListening(true);
  }
 };

 return (
  <div style={{ position: "relative", width: "100%" }}>
   <Button
    onPress={toggleListening}
    color={listening ? "danger" : "primary"}
    isDisabled={isDisabled}
    radius="full"
    className="mb-2"
   >
    {listening ? "⏹ Detener" : "🎤 Hablar"}
   </Button>

   <Textarea
    variant="bordered"
    label={label}
    value={finalText + interimText} // siempre muestra todo
    isDisabled={isDisabled}
    onChange={(e) => {
     setFinalText(e.target.value);
     onChange(name, e.target.value);
    }}
    isInvalid={isInvalid}
    errorMessage={errorMessage}
   />
  </div>
 );
};

export default VoiceTextarea;

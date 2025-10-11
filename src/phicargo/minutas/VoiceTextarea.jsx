import { Button, Textarea } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";

const VoiceTextarea = ({
  value = "",
  name = "",
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
  const [finalText, setFinalText] = useState(value);

  // Mantén sincronizado el valor externo con el interno
  useEffect(() => {
    setFinalText(value);
  }, [value]);

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

      if (newFinalTranscript) {
        setFinalText((prev) => {
          const updated = prev + newFinalTranscript;

          // Envía cambio al padre (adaptar según tu handler)
          if (onChange) onChange(name, updated);

          return updated;
        });
      }

      setInterimText(newInterimTranscript);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [lang]); // <-- solo depende del idioma

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      setInterimText("");
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
        value={finalText + interimText}
        isDisabled={isDisabled}
        onChange={(e) => {
          setFinalText(e.target.value);
          if (onChange) onChange(name, e.target.value);
        }}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default VoiceTextarea;

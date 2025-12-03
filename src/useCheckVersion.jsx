import { useEffect, useState } from "react";
import { APP_VERSION } from "./app_version";

export const useCheckVersion = (interval = 60000) => {
 const [hasUpdate, setHasUpdate] = useState(false);

 useEffect(() => {
  const check = async () => {
   try {
    const res = await fetch("/version.json?t=" + Date.now());
    const data = await res.json();

    if (data.version !== APP_VERSION) {
     setHasUpdate(true);
    }
   } catch (error) {
    console.error("Error al verificar version.json", error);
   }
  };

  check(); // Primera verificación
  const timer = setInterval(check, interval);

  return () => clearInterval(timer);
 }, [interval]);

 return hasUpdate;
};

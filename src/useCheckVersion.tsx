import { useEffect, useState } from "react";

export const useCheckVersion = (interval = 60000) => {
 const [currentVersion, setCurrentVersion] = useState(null);
 const [latestVersion, setLatestVersion] = useState(null);
 const [hasUpdate, setHasUpdate] = useState(false);

 const loadLocalVersion = async () => {
  const res = await fetch("/version.json?t=" + Date.now());
  const json = await res.json();
  setCurrentVersion(json.version);
 };

 const checkForUpdate = async () => {
  const res = await fetch("/version.json?t=" + Date.now());
  const json = await res.json();
  setLatestVersion(json.version);
 };

 useEffect(() => {
  loadLocalVersion(); // versión que cargó el usuario

  const timer = setInterval(checkForUpdate, interval);
  checkForUpdate(); // primera verificación inmediata

  return () => clearInterval(timer);
 }, [interval]);

 useEffect(() => {
  if (currentVersion && latestVersion && currentVersion !== latestVersion) {
   setHasUpdate(true);
  }
 }, [currentVersion, latestVersion]);

 return hasUpdate;
};

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems } from '../pages/MenuItems';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AppsIcon from "@mui/icons-material/Apps";
import { Button } from "@heroui/react";

export default function GoogleAppsMenu() {
 const [open, setOpen] = useState(false);
 const menuRef = useRef(null);

 // Cerrar al hacer clic fuera
 useEffect(() => {
  const handleClickOutside = (e) => {
   if (menuRef.current && !menuRef.current.contains(e.target)) {
    setOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 // Cerrar con ESC
 useEffect(() => {
  const handleEsc = (e) => {
   if (e.key === "Escape") setOpen(false);
  };
  document.addEventListener("keydown", handleEsc);
  return () => document.removeEventListener("keydown", handleEsc);
 }, []);

 const navigate = useNavigate();

 const handleClick = (link) => {
  navigate(link);
 };

 return (
  <div className="relative" ref={menuRef}>
   {/* Botón */}

   <IconButton
    color="inherit"
    onClick={() => setOpen(!open)}
    sx={{ mr: 2 }}
   >
    <AppsIcon />
   </IconButton>

   {/* MENÚ */}
   <AnimatePresence>
    {open && (
     <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.18 }}
      className="
    fixed top-12 left-2 w-80 
    bg-white rounded-3xl shadow-xl border border-gray-200 
    p-4 grid grid-cols-3 gap-4 
    max-h-[80vh] overflow-y-auto 
    z-[9999]
  "
     >

      {menuItems.map((app) => (
       <div key={app.name}>
        <div
         className="flex flex-col items-center p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
         onClick={() => handleClick(app.link)}
        >
         <img src={app.icon} alt={app.name} className="w-9 h-9" />
         <span className="text-[14px] mt-2 text-gray-700 text-center">
          {app.label}
         </span>
        </div>
       </div>
      ))}

      <div className="col-span-3 mb-2 flex justify-center">
       <Button color="primary" onPress={() => handleClick('/menu')} radius="full">
        Menu principal
       </Button>
      </div>
      
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}

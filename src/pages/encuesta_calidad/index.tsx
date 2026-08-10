import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EncuestaCalidad from "./form";


const EncuestaCalidadIndex = () => {

  return (
    <div>
      <ToastContainer
        position="top-center"></ToastContainer>
      <EncuestaCalidad></EncuestaCalidad>
    </div>
  );
};

export default EncuestaCalidadIndex;

import Minutas from "./minutas";
import { MinutasProvider } from "./context";
import CustomNavbar from "@/pages/CustomNavbar";

export default function ControlMinutas() {
    return (
        <MinutasProvider>
            <CustomNavbar></CustomNavbar>
            <Minutas />
        </MinutasProvider>
    );
}

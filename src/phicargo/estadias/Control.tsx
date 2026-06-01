import CustomNavbar from "@/pages/CustomNavbar";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";

export default function EstadiasIndex() {
    return (
        <>
            <ViajeProvider>
                <CostosExtrasProvider>
                    <CustomNavbar></CustomNavbar>
                    <RegistrosEstadias></RegistrosEstadias>
                </CostosExtrasProvider>
            </ViajeProvider>
        </>
    );
}

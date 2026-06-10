import CustomNavbar from "@/pages/CustomNavbar";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";
import { pages } from "../viajes/pages";

export default function EstadiasIndex() {
    return (
        <>
            <ViajeProvider>
                <CostosExtrasProvider>
                    <CustomNavbar pages={pages}></CustomNavbar>
                    <RegistrosEstadias></RegistrosEstadias>
                </CostosExtrasProvider>
            </ViajeProvider>
        </>
    );
}

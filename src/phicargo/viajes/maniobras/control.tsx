import Maniobras from "./tabla";
import { ManiobraProvider } from "@/phicargo/maniobras/context/viajeContext";

export default function ManiobrasViajes() {

    return (
        <>
            <ManiobraProvider>
                <Maniobras />
            </ManiobraProvider>
        </>
    );
}

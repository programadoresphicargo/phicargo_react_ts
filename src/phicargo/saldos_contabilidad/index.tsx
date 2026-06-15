import CustomNavbar from "@/pages/CustomNavbar";
import SaldosTable from "./tabla";
import { pages } from "./pages";

export default function Saldos() {
    return (
        <>
            <CustomNavbar pages={pages}></CustomNavbar>
            <SaldosTable></SaldosTable>
        </>
    );
}

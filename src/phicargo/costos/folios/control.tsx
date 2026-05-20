import { CostosExtrasProvider } from "../context/context";
import FoliosCostosExtras from "./tabla";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from './pages';

export default function control_maniobras() {

    return (
        <>
            <CostosExtrasProvider>
                <CustomNavbar pages={pages}></CustomNavbar>
                <FoliosCostosExtras></FoliosCostosExtras>
            </CostosExtrasProvider>
        </>
    );
}

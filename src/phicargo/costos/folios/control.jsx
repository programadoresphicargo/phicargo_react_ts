import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import { CostosExtrasProvider } from "../context/context";
import FoliosCostosExtras from "./tabla";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../folios/pages';

export default function control_maniobras() {

    return (
        <div>
            <CostosExtrasProvider>
                <CustomNavbar pages={pages}></CustomNavbar>
                <FoliosCostosExtras></FoliosCostosExtras>
            </CostosExtrasProvider>
        </div>
    );
}

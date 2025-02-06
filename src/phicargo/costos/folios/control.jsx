import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import ManiobrasNavBar from "../Navbar";
import { CostosExtrasProvider } from "../context/context";

export default function control_maniobras() {
    return (
        <div>
            <CostosExtrasProvider>
                <ManiobrasNavBar />
                <Maniobras/>
            </CostosExtrasProvider>
        </div>
    );
}

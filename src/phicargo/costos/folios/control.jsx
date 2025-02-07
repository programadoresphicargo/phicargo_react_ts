import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import { CostosExtrasProvider } from "../context/context";
import CENavBar from "../Navbar";

export default function control_maniobras() {
    return (
        <div>
            <CostosExtrasProvider>
                <CENavBar />
                <Maniobras />
            </CostosExtrasProvider>
        </div>
    );
}

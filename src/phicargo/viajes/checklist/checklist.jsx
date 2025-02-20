import React from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@heroui/react";
import ChecklistDetalle from ".";

export default function Checklist() {
    const [selected, setSelected] = React.useState("photos");

    return (
        <div className="flex w-full flex-col">
            <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={setSelected}
            >
                <Tab key="salida" title="Salida">
                    <Card>
                        <CardBody>
                            <ChecklistDetalle></ChecklistDetalle>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="reingreso" title="Reingreso">
                    <Card>
                        <CardBody>
                            <ChecklistDetalle></ChecklistDetalle>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

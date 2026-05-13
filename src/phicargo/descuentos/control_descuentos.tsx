import { DescuentosProvider } from "./context";
import Descuentos from "./descuentos";

export default function ControlDescuentos() {

    return (
        <DescuentosProvider>
            <Descuentos></Descuentos>
        </DescuentosProvider>
    );
}

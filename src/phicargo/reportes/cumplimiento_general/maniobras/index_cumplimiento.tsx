import { ManiobraProvider } from '@/phicargo/maniobras/context/viajeContext';
import ReporteCumplimientoManiobra from './cumplimiento_maniobra';

const RepCumplimientoManiobra = () => {

    return (
        <ManiobraProvider>
            <ReporteCumplimientoManiobra></ReporteCumplimientoManiobra>
        </ManiobraProvider>
    );
};

export default RepCumplimientoManiobra;

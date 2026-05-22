import ReporteCumplimientoEjecutivoManiobra from './cumplimiento_ejecutivos_maniobra';
import { ManiobraProvider } from '@/phicargo/maniobras/context/viajeContext';

const ReporteCumplimientoEjecutivoManiobraIndex = () => {

    return (
        <ManiobraProvider>
            <ReporteCumplimientoEjecutivoManiobra></ReporteCumplimientoEjecutivoManiobra>
        </ManiobraProvider>
    );
};

export default ReporteCumplimientoEjecutivoManiobraIndex;

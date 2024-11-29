import React from 'react';
import { CostosExtrasProvider } from './context/estadiasContext';
import RegistrosCE from './registros';

const ControlCostosExtras = () => {
    return (
        <CostosExtrasProvider>
            <RegistrosCE></RegistrosCE>
        </CostosExtrasProvider>
    );
};

export default ControlCostosExtras;

import React from 'react';
import { Chip } from '@heroui/react';

const EstatusChipLlegadaPlanta = ({ valor }) => {
    let color;

    switch (valor) {
        case 'Llegó tarde':
            color = 'danger';
            break;
        case 'Va tarde':
            color = 'warning';
            break;
        case 'Llegó temprano':
            color = 'primary';
            break;
        default:
            color = 'primary';
    }

    return (
        <Chip color={color} size="sm">
            {valor || "Sin información"}
        </Chip>
    );
};

export default EstatusChipLlegadaPlanta;

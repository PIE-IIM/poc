import React from 'react';

const SoilTensionDisplay = ({ tension_sol }) => {
    return (
        <div>
            <h2>Tension du sol</h2>
            <p>{tension_sol !== null ? `${tension_sol} %` : 'Données non disponibles'}</p>
        </div>
    );
};

export default SoilTensionDisplay;

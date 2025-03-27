import React from 'react';

const TemperatureDisplay = ({ temperature }) => {
    return (
        <div>
            <h2>Température</h2>
            <p>{temperature !== null ? `${temperature} °C` : 'Données non disponibles'}</p>
        </div>
    );
};

export default TemperatureDisplay;

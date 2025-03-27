import React from 'react';

const HumidityDisplay = ({ humidite }) => {
    return (
        <div>
            <h2>Humidité</h2>
            <p>{humidite !== null ? `${humidite} %` : 'Données non disponibles'}</p>
        </div>
    );
};

export default HumidityDisplay;

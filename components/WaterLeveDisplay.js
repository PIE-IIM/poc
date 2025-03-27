import React from 'react';

const WaterLevelDisplay = ({ niveau_eau }) => {
    return (
        <div>
            <h2>Niveau d'eau</h2>
            <p>{niveau_eau !== null ? `${niveau_eau} %` : 'Données non disponibles'}</p>
        </div>
    );
};

export default WaterLevelDisplay;

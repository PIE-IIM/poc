import React from 'react';

const LuminosityDisplay = ({ luminosite }) => {
    return (
        <div>
            <h2>Luminosité</h2>
            <p>{luminosite !== null ? `${luminosite} %` : 'Données non disponibles'}</p>
        </div>
    );
};

export default LuminosityDisplay;

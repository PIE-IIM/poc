import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TemperatureDisplay from './TemperatureDisplay';
import HumidityDisplay from './HumidityDisplay';
import LuminosityDisplay from './LuminosityDisplay';
import WaterLevelDisplay from './WaterLevelDisplay';
import SoilTensionDisplay from './SoilTensionDisplay';

const SensorDataComponent = () => {
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidite: null,
        pourcentage_luminosite: null,
        valeur_eau: null,
        tension_sol: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const temperature = await axios.get('http://localhost:3001/api/temperature');
                const humidite = await axios.get('http://localhost:3001/api/humidite');
                const sol = await axios.get('http://localhost:3001/api/sol');
                const luminosite = await axios.get('http://localhost:3001/api/luminosite');
                const niveau_eau = await axios.get('http://localhost:3001/api/niveau_eau');

                const data = {
                    temperature: temperature.data.temperature,
                    humidite: humidite.data.humidite,
                    pourcentage_luminosite: luminosite.data.pourcentage_luminosite,
                    valeur_eau: niveau_eau.data.valeur_eau,
                    tension_sol: sol.data.tension_sol
                };

                setSensorData(data);
                localStorage.setItem('sensorData', JSON.stringify(data));
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
        window.location.reload()
    }, []);

    useEffect(() => {
        const storedData = localStorage.getItem('sensorData');
        if (storedData) {
            setSensorData(JSON.parse(storedData));
        }
    }, []);

    return (
        <div>
            <h1>Données des capteurs</h1>
            <TemperatureDisplay temperature={sensorData.temperature} />
            <HumidityDisplay humidite={sensorData.humidite} />
            <LuminosityDisplay luminosite={sensorData.pourcentage_luminosite} />
            <WaterLevelDisplay niveau_eau={sensorData.valeur_eau} />
            <SoilTensionDisplay tension_sol={sensorData.tension_sol} />
        </div>
    );
};

export default SensorDataComponent;
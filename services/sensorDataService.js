import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const sensorDataService = {
    async fetchTemperature() {
        const response = await axios.get(`${API_BASE_URL}/temperature`);
        return response.data.temperature;
    },

    async fetchHumidity() {
        const response = await axios.get(`${API_BASE_URL}/humidite`);
        return response.data.humidite;
    },

    async fetchLuminosity() {
        const response = await axios.get(`${API_BASE_URL}/luminosite`);
        return response.data.pourcentage_luminosite;
    },

    async fetchWaterLevel() {
        const response = await axios.get(`${API_BASE_URL}/niveau_eau`);
        return response.data.valeur_eau;
    },

    async fetchSoilTension() {
        const response = await axios.get(`${API_BASE_URL}/sol`);
        return response.data.tension_sol;
    },

    async fetchAllSensorData() {
        try {
            const [temperature, humidity, luminosity, waterLevel, soilTension] = await Promise.all([
                this.fetchTemperature(),
                this.fetchHumidity(),
                this.fetchLuminosity(),
                this.fetchWaterLevel(),
                this.fetchSoilTension()
            ]);

            return {
                temperature,
                humidite: humidity,
                pourcentage_luminosite: luminosity,
                valeur_eau: waterLevel,
                tension_sol: soilTension
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des données des capteurs :', error);
            throw error;
        }
    }
};

export default sensorDataService;

const express = require("express");
const cors = require("cors");
const { Machine, DHT } = require('your-sensor-library');
const app = express();
const port = 3000;

app.use(cors());

const capteur_dht = new DHT(28, DHT.DHT11);
const capteur_luminosite = new Machine.ADC(28);
const capteur_eau = new Machine.ADC(28);
const capteur_sol = new Machine.ADC(28);

const readSensors = () => {
    try {
        capteur_dht.measure();
        const temperature = capteur_dht.temperature();
        const humidite = capteur_dht.humidity();

        const valeur_luminosite = capteur_luminosite.read_u16();
        const pourcentage_luminosite = (valeur_luminosite / 65535) * 100;

        const valeur_eau = capteur_eau.read_u16();

        const valeur_sol = capteur_sol.read_u16();
        const tension_sol = (valeur_sol / 65535) * 3.3;

        return {
            temperature,
            humidite,
            pourcentage_luminosite,
            valeur_eau,
            tension_sol
        };
    } catch (e) {
        console.error("Erreur de lecture des capteurs :", e);
        return null;
    }
};

app.get("/api/temperature", (req, res) => {
    const data = readSensors();
    if (data) {
        res.json({ temperature: data.temperature });
    } else {
        res.status(500).json({ error: "Erreur de lecture du capteur" });
    }
});

app.get("/api/humidite", (req, res) => {
    const data = readSensors();
    if (data) {
        res.json({ humidite: data.humidite });
    } else {
        res.status(500).json({ error: "Erreur de lecture du capteur" });
    }
});

app.get("/api/sol", (req, res) => {
    const data = readSensors();
    if (data) {
        res.json({ humidite_sol: data.tension_sol });
    } else {
        res.status(500).json({ error: "Erreur de lecture du capteur" });
    }
});

app.get("/api/luminosite", (req, res) => {
    const data = readSensors();
    if (data) {
        res.json({ luminosite: data.pourcentage_luminosite });
    } else {
        res.status(500).json({ error: "Erreur de lecture du capteur" });
    }
});

app.get("/api/niveau_eau", (req, res) => {
    const data = readSensors();
    if (data) {
        res.json({ niveau_eau: data.valeur_eau > 30000 ? "OK" : "VIDE" });
    } else {
        res.status(500).json({ error: "Erreur de lecture du capteur" });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

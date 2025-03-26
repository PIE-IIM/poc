const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let sensorData = {
    temperature: null,
    humidite: null,
    pourcentage_luminosite: null,
    valeur_eau: null,
    tension_sol: null
};

app.post("/api/temperature", (req, res) => {
    const { temperature } = req.body;
    sensorData.temperature = temperature;
    console.log("Température reçue :", temperature);
    res.status(200).send("Données reçues avec succès");
});

app.post("/api/humidite", (req, res) => {
    const { humidite } = req.body;
    sensorData.humidite = humidite;
    console.log("Humidité reçue :", humidite);
    res.status(200).send("Données reçues avec succès");
});

app.post("/api/sol", (req, res) => {
    const { humidite_sol } = req.body;
    sensorData.tension_sol = humidite_sol;
    console.log("Humidité du sol reçue :", humidite_sol);
    res.status(200).send("Données reçues avec succès");
});

app.post("/api/luminosite", (req, res) => {
    const { luminosite } = req.body;
    sensorData.pourcentage_luminosite = luminosite;
    console.log("Luminosité reçue :", luminosite);
    res.status(200).send("Données reçues avec succès");
});

app.post("/api/niveau_eau", (req, res) => {
    const { niveau_eau } = req.body;
    sensorData.valeur_eau = niveau_eau;
    console.log("Niveau d'eau reçu :", niveau_eau);
    res.status(200).send("Données reçues avec succès");
});

app.get("/api/sensorData", (req, res) => {
    res.json(sensorData);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

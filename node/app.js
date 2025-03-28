const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

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
    const { humidite_sol, valeur_brute_sol } = req.body;
    sensorData.tension_sol = humidite_sol;
    sensorData.valeur_brute_sol = valeur_brute_sol; 
    console.log("Humidité du sol reçue :", humidite_sol);
    console.log("Valeur brute du capteur de sol :", valeur_brute_sol);
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

app.get("/api/temperature", (req, res) => {
    res.json({ temperature: sensorData.temperature });
});

app.get("/api/humidite", (req, res) => {
    res.json({ humidite: sensorData.humidite });
});

app.get("/api/sol", (req, res) => {
    res.json({ tension_sol: sensorData.tension_sol, valeur_brute_sol: sensorData.valeur_brute_sol });
});

app.get("/api/luminosite", (req, res) => {
    res.json({ pourcentage_luminosite: sensorData.pourcentage_luminosite });
});

app.get("/api/niveau_eau", (req, res) => {
    res.json({ valeur_eau: sensorData.valeur_eau });
});

app.get("/api/sensorData", (req, res) => {
    res.json(sensorData);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
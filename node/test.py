import machine
import dht
import time
import urequests
import network

#Initialisation des capteurs
#Capteur DHT11 sur GP16 (Pin 21)
capteur_dht = dht.DHT11(machine.Pin(13))

#Capteur de luminosité connecté à ADC0 (GP26)
capteur_luminosite = machine.ADC(28)

#Capteur de niveau d'eau sur GP28 (ADC2)
capteur_eau = machine.ADC(26)

#Capteur d'humidité dans le sol sur GP28 (ADC2)
capteur_sol = machine.ADC(27)

#URL du backend Node.js
backend_url = "http://10.2.104.40:3001"  # Remplacez par l'adresse IP locale de votre PC

#Configuration du module ESP8266
def connect_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    # Attendre la connexion
    while not wlan.isconnected():
        print("Connexion en cours...")
        time.sleep(1)

    print("Connecté au réseau Wi-Fi")
    print("Adresse IP :", wlan.ifconfig()[0])

#Remplacez par votre SSID et mot de passe Wi-Fi
ssid = "PoleDeVinci_Private"
password = "Creatvive_Lab_2024"

connect_wifi(ssid, password)

def send_data_to_backend(endpoint, data):
    url = f"{backend_url}/{endpoint}"
    try:
        response = urequests.post(url, json=data)
        if response.status_code == 200:
            print(f"Données envoyées avec succès à {url}")
        else:
            print(f"Erreur lors de l'envoi des données à {url}: {response.status_code}")
        response.close()
    except Exception as e:
        print(f"Erreur de connexion : {e}")

while True:
    try:
        # Lecture du capteur DHT11
        capteur_dht.measure()
        temperature = capteur_dht.temperature()
        humidite = capteur_dht.humidity()
        print("Température : {}°C".format(temperature))
        print("Humidité : {}%".format(humidite))

        # Envoyer les données de température et d'humidité au backend
        send_data_to_backend("api/temperature", {"temperature": temperature})
        send_data_to_backend("api/humidite", {"humidite": humidite})

    except OSError as e:
        print("Erreur de lecture du capteur DHT11 :", e)

    # Lecture du capteur de luminosité
    valeur_luminosite = capteur_luminosite.read_u16()
    pourcentage_luminosite = (1 - (valeur_luminosite / 65535)) * 100
    print("Luminosité : {:.2f}%".format(pourcentage_luminosite))

    # Envoyer les données de luminosité au backend
    send_data_to_backend("api/luminosite", {"luminosite": pourcentage_luminosite})

    # Lecture du capteur de niveau d'eau
    valeur_eau = capteur_eau.read_u16()
    print("Valeur brute du capteur d'eau :", valeur_eau)

    # Envoyer les données de niveau d'eau au backend
    send_data_to_backend("api/niveau_eau", {"niveau_eau": valeur_eau})

    # Lecture du capteur d'humidité dans le sol
    valeur_sol = capteur_sol.read_u16()
    tension_sol = (valeur_sol / 65535) * 3.3
    print("Valeur brute du capteur de sol :", valeur_sol)
    print("Tension approx. : {:.2f} V".format(tension_sol))

    # Envoyer les données d'humidité du sol au backend
    send_data_to_backend("api/sol", {
    "humidite_sol": tension_sol,
    "valeur_brute_sol": valeur_sol
})

    # Affichage simple du niveau d'humidité dans le sol
    if valeur_sol < 20000:
        print("💧 Niveau élevé")  # Très humide
    elif valeur_sol < 50000:
        print("🌊 Niveau moyen")
    else:
        print("⚠️ Niveau bas ou sec")  # Sec

    print("-------------------------")
    time.sleep(2)
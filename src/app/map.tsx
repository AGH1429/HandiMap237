import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function MapScreen() {
  const router = useRouter();

  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des établissements depuis l'API
  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const response = await fetch('http://10.30.201.208:3000/api/places/search?category=&city=');

      console.log('Status API:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      console.log('Établissements reçus:', data);

      if (Array.isArray(data)) {
        // On garde uniquement les établissements
        // possédant des coordonnées valides
        const validPlaces = data
          .map((place: any) => ({
            ...place,
            latitude: Number(place.latitude),
            longitude: Number(place.longitude),
            accessibility_score: Number(place.accessibility_score),
          }))
          .filter(
            (place: any) =>
              Number.isFinite(place.latitude) &&
              Number.isFinite(place.longitude)
          );

        setPlaces(validPlaces);
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.log('Erreur lors du chargement des lieux:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  // Création de la page Leaflet
  const placesJson = JSON.stringify(places).replace(/</g, '\\u003c');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
      </script>

      <style>

        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .leaflet-popup-content {
          font-family: Arial, sans-serif;
        }

        .place-name {
          font-size: 16px;
          font-weight: bold;
          color: #1a2d6e;
          margin-bottom: 5px;
        }

        .place-category {
          color: #0096c7;
          margin-bottom: 5px;
        }

        .place-score {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .place-address {
          color: #666;
          font-size: 12px;
        }

      </style>

    </head>

    <body>

      <div id="map"></div>

      <script>

        // Création de la carte centrée sur Yaoundé
        const map = L.map('map').setView(
          [3.848, 11.502],
          13
        );

        // Fond OpenStreetMap
        L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; OpenStreetMap contributors'
          }
        ).addTo(map);


        // Données provenant de l'API HandiMap 237
        const places = ${placesJson};


        // Déterminer la couleur selon le score
        function getMarkerColor(score) {

          if (score >= 8) {
            return 'green';
          }

          if (score >= 5) {
            return 'orange';
          }

          return 'red';
        }


        // Affichage des établissements
        places.forEach(function(place) {

          const score = Number(place.accessibility_score) || 0;

          const color = getMarkerColor(score);


          // Marqueur circulaire
          const marker = L.circleMarker(
            [
              Number(place.latitude),
              Number(place.longitude)
            ],
            {
              radius: 10,
              fillColor: color,
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9
            }
          );


          // Informations du lieu
          const name =
            place.name || 'Établissement';

          const category =
            place.category || 'Non précisée';

          const address =
            place.address || 'Adresse non disponible';


          // Popup
          marker.bindPopup(
            '<div>' +

              '<div class="place-name">' +
                name +
              '</div>' +

              '<div class="place-category">' +
                '📍 ' + category +
              '</div>' +

              '<div class="place-score">' +
                'Score d’accessibilité : ' +
                score +
                '/10' +
              '</div>' +

              '<div class="place-address">' +
                address +
              '</div>' +

            '</div>'
          );


          marker.addTo(map);

        });

      </script>

    </body>
    </html>
  `;


  return (
    <View style={styles.container}>

      {/* En-tête */}
      <LinearGradient
        colors={['#48cae4', '#0096c7']}
        style={styles.header}
      >

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Retour
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Carte des lieux accessibles
        </Text>

        <Text style={styles.headerSubtitle}>
          Yaoundé, Cameroun
        </Text>

      </LinearGradient>


      {/* Légende */}
      <View style={styles.legend}>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              { backgroundColor: 'green' }
            ]}
          />
          <Text style={styles.legendText}>
            Très accessible (8-10)
          </Text>
        </View>


        <View style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              { backgroundColor: 'orange' }
            ]}
          />
          <Text style={styles.legendText}>
            Moyen (5-7)
          </Text>
        </View>


        <View style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              { backgroundColor: 'red' }
            ]}
          />
          <Text style={styles.legendText}>
            Peu accessible (0-4)
          </Text>
        </View>

      </View>


      {/* Carte */}
      {loading ? (

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
            color="#0096c7"
          />

          <Text style={styles.loadingText}>
            Chargement des lieux...
          </Text>

        </View>

      ) : (

        <WebView
          source={{ html }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.map}
        />

      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },

  header: {
    padding: 28,
    paddingTop: 55,
  },

  backButton: {
    marginBottom: 12,
  },

  backText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    elevation: 2,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },

  legendText: {
    fontSize: 10,
    color: '#333',
  },

  map: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#0096c7',
    marginTop: 12,
  },

});
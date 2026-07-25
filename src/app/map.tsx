import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function MapScreen() {
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const response = await fetch('http://10.97.130.208:3000/api/places/search?category=&city=');
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.log('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  function getMarkerColor(score: number) {
    if (score >= 8) return 'green';
    if (score >= 5) return 'orange';
    return 'red';
  }

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carte des lieux accessibles</Text>
        <Text style={styles.headerSubtitle}>Yaoundé, Cameroun</Text>
      </LinearGradient>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'green' }]} />
          <Text style={styles.legendText}>Très accessible (8-10)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'orange' }]} />
          <Text style={styles.legendText}>Moyen (5-7)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Peu accessible (0-4)</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0096c7" />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          provider={undefined}
          initialRegion={{
          latitude: 3.848,
          longitude: 11.502,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
         }}
        >
        {places.map((place: any) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              pinColor={getMarkerColor(place.accessibility_score)}
            >
              <Callout style={styles.callout}>
                <Text style={styles.calloutName}>{place.name}</Text>
                <Text style={styles.calloutCategory}>📍 {place.category}</Text>
                <Text style={styles.calloutScore}>Score: {place.accessibility_score}/10</Text>
                <Text style={styles.calloutAddress}>{place.address}</Text>
              </Callout>
            </Marker>
        ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { padding: 28, paddingTop: 55 },
  backButton: { marginBottom: 12 },
  backText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  headerTitle: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  legend: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', padding: 10, elevation: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
  legendText: { fontSize: 10, fontFamily: 'Poppins_400Regular', color: '#333' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Poppins_400Regular', color: '#0096c7', marginTop: 12 },
  callout: { width: 180, padding: 8 },
  calloutName: { fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#1a2d6e' },
  calloutCategory: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#0096c7', marginTop: 2 },
  calloutScore: { fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#00b894', marginTop: 2 },
  calloutAddress: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#888', marginTop: 2 },
});
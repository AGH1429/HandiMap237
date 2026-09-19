import { Poppins_400Regular, Poppins_400Regular_Italic, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProposeScreen() {
 
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [hasRamp, setHasRamp] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [hasToilet, setHasToilet] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasWideDoors, setHasWideDoors] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
  });

  if (!fontsLoaded) return null;

  async function handlePropose() {
    if (!name || !category || !address || !city) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {

      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.30.201.208:3000/api/places/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name, category, address, city,
          latitude: 3.848,
          longitude: 11.502,
          has_ramp: hasRamp,
          has_elevator: hasElevator,
          has_adapted_toilet: hasToilet,
          has_parking: hasParking,
          has_wide_doors: hasWideDoors,
          floor_level: 0,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès !', 'Votre lieu a été soumis pour validation. Merci !', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  }

  const SwitchRow = ({ label, value, onValueChange }: any) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ddd', true: '#48cae4' }}
        thumbColor={value ? '#0096c7' : '#fff'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proposer un lieu</Text>
        <Text style={styles.headerSubtitle}>Aidez la communauté HandiMap 237</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Informations du lieu</Text>

          <Text style={styles.label}>Nom du lieu *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Restaurant La Terrasse"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Catégorie *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: restaurant, magasin, hopital..."
            placeholderTextColor="#aaa"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Avenue Kennedy, Bastos"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Ville *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Yaoundé"
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>♿ Critères d'accessibilité</Text>
          <Text style={styles.cardSubtitle}>Cochez les équipements disponibles dans ce lieu</Text>

          <SwitchRow label="♿ Rampe d'accès" value={hasRamp} onValueChange={setHasRamp} />
          <SwitchRow label="🛗 Ascenseur" value={hasElevator} onValueChange={setHasElevator} />
          <SwitchRow label="🚻 Toilettes adaptées" value={hasToilet} onValueChange={setHasToilet} />
          <SwitchRow label="🅿️ Parking handicapé" value={hasParking} onValueChange={setHasParking} />
          <SwitchRow label="🚪 Portes larges" value={hasWideDoors} onValueChange={setHasWideDoors} />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Votre proposition sera examinée par un administrateur avant d'être publiée.
          </Text>
        </View>

        <TouchableOpacity onPress={handlePropose} disabled={loading}>
          <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.submitButton}>
            <Text style={styles.submitText}>
              {loading ? 'Envoi en cours...' : '✅ Soumettre le lieu'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { padding: 28, paddingTop: 55 },
  backButton: { marginBottom: 12 },
  backText: { color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
  headerTitle: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins_400Regular_Italic', color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 4 },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#1a2d6e', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, fontFamily: 'Poppins_400Regular_Italic', color: '#888', marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#f5f7ff', borderRadius: 10, padding: 12, fontSize: 14, fontFamily: 'Poppins_400Regular', borderWidth: 1, borderColor: '#dde3f0', color: '#333' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f4ff' },
  switchLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#333' },
  infoBox: { backgroundColor: '#e8f4fd', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#0096c7' },
  infoText: { fontSize: 13, fontFamily: 'Poppins_400Regular_Italic', color: '#0096c7' },
  submitButton: { borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 40 },
  submitText: { color: '#fff', fontFamily: 'Poppins_700Bold', fontSize: 16 },
});
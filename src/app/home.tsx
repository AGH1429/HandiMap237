import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular, Poppins_400Regular_Italic } from '@expo-google-fonts/poppins';

export default function HomeScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
  });

  if (!fontsLoaded) return null;

  const theme = {
    bg: darkMode ? '#1a1a2e' : '#f0f4ff',
    cardBg: darkMode ? '#16213e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#1a2d6e',
    subtext: darkMode ? '#a0a0b0' : '#666',
  };

  const categories = [
    { icon: '🍽️', label: 'Restaurants', color: ['#ff6b6b', '#ee5a24'] },
    { icon: '🏪', label: 'Magasins', color: ['#a29bfe', '#6c5ce7'] },
    { icon: '🏥', label: 'Hôpitaux', color: ['#55efc4', '#00b894'] },
    { icon: '🏋️', label: 'Salles de sport', color: ['#fdcb6e', '#e17055'] },
    { icon: '🏦', label: 'Banques', color: ['#74b9ff', '#0984e3'] },
    { icon: '💊', label: 'Pharmacies', color: ['#fd79a8', '#e84393'] },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.header}>
        <View style={styles.themeToggle}>
          <Text style={styles.themeText}>{darkMode ? '🌙' : '☀️'}</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#a0c4ff', true: '#444' }}
            thumbColor="#fff"
          />
        </View>
        <Text style={styles.headerIcon}>♿</Text>
        <Text style={styles.headerTitle}>HandiMap 237</Text>
        <Text style={styles.headerSubtitle}>Trouvez des lieux accessibles près de vous</Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.bg }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Que recherchez-vous ?</Text>

        <View style={styles.grid}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardWrapper}
              onPress={() => router.push('/search' as any)}
            >
              <LinearGradient colors={cat.color as [string, string]} style={styles.card}>
                <Text style={styles.cardIcon}>{cat.icon}</Text>
                <Text style={styles.cardText}>{cat.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions rapides</Text>

        <TouchableOpacity onPress={() => router.push('/propose' as any)}>
          <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.actionButton}>
            <Text style={styles.actionIcon}>➕</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Proposer un lieu</Text>
              <Text style={styles.actionSubtitle}>Aidez la communauté en ajoutant un lieu accessible</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/map' as any)}>
          <LinearGradient colors={['#00b894', '#00cec9']} style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Voir la carte</Text>
              <Text style={styles.actionSubtitle}>Visualisez les lieux accessibles sur la carte</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/admin' as any)}>
          <LinearGradient colors={['#e17055', '#d63031']} style={styles.actionButton}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Dashboard Admin</Text>
              <Text style={styles.actionSubtitle}>Gérer les lieux et les utilisateurs</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: { fontSize: 18, marginRight: 6 },
  headerIcon: { fontSize: 52, marginBottom: 8 },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular_Italic',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardWrapper: {
    width: '30%',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardText: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  actionButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
  },
  actionIcon: { fontSize: 32, marginRight: 16 },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  actionSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular_Italic',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
});
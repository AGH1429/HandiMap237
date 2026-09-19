import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular, Poppins_400Regular_Italic } from '@expo-google-fonts/poppins';

export default function SearchScreen() { 
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
  });

  const filters = [
    { key: 'has_ramp', label: '♿ Rampe' },
    { key: 'has_elevator', label: '🛗 Ascenseur' },
    { key: 'has_adapted_toilet', label: '🚻 Toilettes adaptées' },
    { key: 'has_parking', label: '🅿️ Parking' },
    { key: 'has_wide_doors', label: '🚪 Portes larges' },
  ];

  function toggleFilter(key: string) {
    setSelectedFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  }

  async function handleSearch() {

    if (!search) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ category: search, city });
      const response = await fetch(`http://10.30.201.208:3000/api/places/search?${params}`);
      const data = await response.json();
      let filtered = data;
      if (selectedFilters.length > 0) {
        filtered = data.filter((place: any) =>
          selectedFilters.every(f => place[f] === true)
        );
      }
      setResults(filtered);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number): [string, string] {
    if (score >= 8) return ['#00b894', '#00cec9'];
    if (score >= 5) return ['#fdcb6e', '#e17055'];
    return ['#ff6b6b', '#ee5a24'];
  }

  function getScoreLabel(score: number) {
    if (score >= 8) return 'Très accessible';
    if (score >= 5) return 'Moyennement accessible';
    return 'Peu accessible';
  }

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rechercher un lieu</Text>
        <Text style={styles.headerSubtitle}>Trouvez des endroits accessibles près de vous</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchCard}>
          <Text style={styles.label}>Type de lieu</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: restaurant, magasin, hopital..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />

          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Yaoundé, Douala..."
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Mes besoins d'accessibilité</Text>
          <View style={styles.filtersContainer}>
            {filters.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, selectedFilters.includes(f.key) && styles.filterChipActive]}
                onPress={() => toggleFilter(f.key)}
              >
                <Text style={[styles.filterText, selectedFilters.includes(f.key) && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleSearch}>
            <LinearGradient colors={['#48cae4', '#0096c7']} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>🔍 Rechercher</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#0096c7" style={{ marginTop: 30 }} />
        )}

        {!loading && searched && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>😔</Text>
            <Text style={styles.emptyText}>Aucun lieu trouvé</Text>
            <Text style={styles.emptySubtext}>Essayez avec d'autres critères</Text>
          </View>
        )}

        {!loading && results.map((place: any) => (
          <View key={place.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{place.name}</Text>
                <Text style={styles.resultCategory}>📍 {place.category}</Text>
                <Text style={styles.resultAddress}>{place.address}, {place.city}</Text>
              </View>
              <LinearGradient colors={getScoreColor(place.accessibility_score)} style={styles.scoreBadge}>
                <Text style={styles.scoreNumber}>{place.accessibility_score}/10</Text>
                <Text style={styles.scoreLabel}>{getScoreLabel(place.accessibility_score)}</Text>
              </LinearGradient>
            </View>

            <View style={styles.amenities}>
              {place.has_ramp && <Text style={styles.amenity}>♿ Rampe</Text>}
              {place.has_elevator && <Text style={styles.amenity}>🛗 Ascenseur</Text>}
              {place.has_adapted_toilet && <Text style={styles.amenity}>🚻 Toilettes</Text>}
              {place.has_parking && <Text style={styles.amenity}>🅿️ Parking</Text>}
              {place.has_wide_doors && <Text style={styles.amenity}>🚪 Portes larges</Text>}
            </View>
          </View>
        ))}
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
  searchCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 4 },
  label: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#f5f7ff', borderRadius: 10, padding: 12, fontSize: 14, fontFamily: 'Poppins_400Regular', borderWidth: 1, borderColor: '#dde3f0', color: '#333' },
  filtersContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 8 },
  filterChip: { borderWidth: 1, borderColor: '#0096c7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  filterChipActive: { backgroundColor: '#0096c7' },
  filterText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#0096c7' },
  filterTextActive: { color: '#fff', fontFamily: 'Poppins_600SemiBold' },
  searchButton: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  searchButtonText: { color: '#fff', fontFamily: 'Poppins_700Bold', fontSize: 15 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: '#333' },
  emptySubtext: { fontSize: 13, fontFamily: 'Poppins_400Regular_Italic', color: '#888', marginTop: 4 },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 4 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resultInfo: { flex: 1, marginRight: 12 },
  resultName: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#1a2d6e' },
  resultCategory: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#0096c7', marginTop: 2 },
  resultAddress: { fontSize: 12, fontFamily: 'Poppins_400Regular_Italic', color: '#888', marginTop: 2 },
  scoreBadge: { borderRadius: 12, padding: 10, alignItems: 'center', minWidth: 80 },
  scoreNumber: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#fff' },
  scoreLabel: { fontSize: 9, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 2 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  amenity: { backgroundColor: '#f0f4ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#1a2d6e' },
});
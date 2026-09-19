 import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular, Poppins_400Regular_Italic } from '@expo-google-fonts/poppins';

export default function AdminScreen() {
  const router = useRouter();
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [approvedPlaces, setApprovedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const response = await fetch('http://10.30.201.208:3000/api/places/search?category=&city=');
      const data = await response.json();
      setPendingPlaces(data.filter((p: any) => !p.is_approved));
      setApprovedPlaces(data.filter((p: any) => p.is_approved));
    } catch (error) {
      console.log('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      const response = await fetch(`http://10.30.201.208:3000/api/places/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer TON_TOKEN',
        },
      });
      if (response.ok) {
        Alert.alert('Succès', 'Lieu approuvé !');
        fetchPlaces();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'approuver ce lieu');
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer ce lieu ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`http://10.30.201.208:3000/api/places/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer TON_TOKEN' },
              });
              fetchPlaces();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer');
            }
          }
        }
      ]
    );
  }

  if (!fontsLoaded) return null;

  const PlaceCard = ({ place, showApprove }: any) => (
    <View style={styles.placeCard}>
      <View style={styles.placeHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeCategory}>📍 {place.category}</Text>
          <Text style={styles.placeAddress}>{place.address}, {place.city}</Text>
        </View>
        <LinearGradient
          colors={place.accessibility_score >= 8 ? ['#00b894', '#00cec9'] : place.accessibility_score >= 5 ? ['#fdcb6e', '#e17055'] : ['#ff6b6b', '#ee5a24']}
          style={styles.scoreBadge}
        >
          <Text style={styles.scoreText}>{place.accessibility_score}/10</Text>
        </LinearGradient>
      </View>

      <View style={styles.amenities}>
        {place.has_ramp && <Text style={styles.amenity}>♿</Text>}
        {place.has_elevator && <Text style={styles.amenity}>🛗</Text>}
        {place.has_adapted_toilet && <Text style={styles.amenity}>🚻</Text>}
        {place.has_parking && <Text style={styles.amenity}>🅿️</Text>}
        {place.has_wide_doors && <Text style={styles.amenity}>🚪</Text>}
      </View>

      <View style={styles.actions}>
        {showApprove && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(place.id)}
          >
            <Text style={styles.approveText}>✅ Approuver</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(place.id)}
        >
          <Text style={styles.deleteText}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#e17055', '#d63031']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Dashboard Admin</Text>
        <Text style={styles.headerSubtitle}>Gestion des lieux HandiMap 237</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{approvedPlaces.length}</Text>
          <Text style={styles.statLabel}>Lieux approuvés</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#e17055' }]}>{pendingPlaces.length}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#0096c7' }]}>{approvedPlaces.length + pendingPlaces.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            En attente ({pendingPlaces.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.tabActive]}
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>
            Approuvés ({approvedPlaces.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e17055" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'pending' && (
            pendingPlaces.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyText}>Aucune proposition en attente</Text>
              </View>
            ) : (
              pendingPlaces.map((place: any) => (
                <PlaceCard key={place.id} place={place} showApprove={true} />
              ))
            )
          )}
          {activeTab === 'approved' && (
            approvedPlaces.map((place: any) => (
              <PlaceCard key={place.id} place={place} showApprove={false} />
            ))
          )}
        </ScrollView>
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
  headerSubtitle: { fontSize: 13, fontFamily: 'Poppins_400Regular_Italic', color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 3 },
  statNumber: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#00b894' },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#888', marginTop: 4, textAlign: 'center' },
  tabs: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#e0e7ff', borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#888' },
  tabTextActive: { color: '#1a2d6e' },
  content: { padding: 16, marginTop: 12 },
  placeCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 3 },
  placeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  placeName: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#1a2d6e' },
  placeCategory: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#0096c7', marginTop: 2 },
  placeAddress: { fontSize: 11, fontFamily: 'Poppins_400Regular_Italic', color: '#888', marginTop: 2 },
  scoreBadge: { borderRadius: 10, padding: 8, alignItems: 'center', minWidth: 60 },
  scoreText: { fontFamily: 'Poppins_700Bold', fontSize: 14, color: '#fff' },
  amenities: { flexDirection: 'row', gap: 8, marginTop: 10 },
  amenity: { fontSize: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  approveButton: { flex: 1, backgroundColor: '#e8f8f5', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#00b894' },
  approveText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#00b894' },
  deleteButton: { flex: 1, backgroundColor: '#ffeaea', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ff6b6b' },
  deleteText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#ff6b6b' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#888' },
});
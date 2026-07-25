import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!name || !email || !password || !confirm) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.97.130.208:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Inscription réussie !', [
          { text: 'OK', onPress: () => router.replace('/login' as any) }
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

  return (
    <LinearGradient colors={['#1a56db', '#0a2d6e']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>♿</Text>
          <Text style={styles.logoText}>HandiMap 237</Text>
          <Text style={styles.tagline}>Créer un compte</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inscription</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre nom complet"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@email.com"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login' as any)}>
            <Text style={styles.link}>
              Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#a0c4ff',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a56db',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f7ff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dde3f0',
    color: '#333',
  },
  button: {
    backgroundColor: '#1a56db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#7aa3e8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  link: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  linkBold: {
    color: '#1a56db',
    fontWeight: 'bold',
  },
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ INSCRIPTION
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Chiffrer le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: 'user' }])
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: data[0].id, role: data[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: { id: data[0].id, name: data[0].name, email: data[0].email, role: data[0].role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✅ CONNEXION
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Chercher l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ RECHERCHER DES LIEUX
router.get('/search', async (req, res) => {
  const { category, city } = req.query;

  try {
    let query = supabase
      .from('places')
      .select('*')
      .eq('is_approved', true);

    if (category) query = query.ilike('category', `%${category}%`);
    if (city) query = query.ilike('city', `%${city}%`);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✅ OBTENIR UN LIEU PAR ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ message: 'Lieu non trouvé' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✅ PROPOSER UN LIEU (utilisateur connecté)
router.post('/propose', authMiddleware, async (req, res) => {
  const {
    name, category, address, city,
    latitude, longitude,
    has_ramp, has_elevator, has_adapted_toilet,
    has_parking, has_wide_doors, floor_level
  } = req.body;

  try {
    // Calcul du score d'accessibilité
    let score = 0;
    if (has_ramp) score += 2;
    if (has_elevator) score += 2;
    if (has_adapted_toilet) score += 2;
    if (has_parking) score += 2;
    if (has_wide_doors) score += 1;
    if (floor_level === 0) score += 1;

    const { data, error } = await supabase
      .from('places')
      .insert([{
        name, category, address, city,
        latitude, longitude,
        has_ramp, has_elevator, has_adapted_toilet,
        has_parking, has_wide_doors, floor_level,
        accessibility_score: score,
        is_approved: false,
        proposed_by: req.user.id
      }])
      .select();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({
      message: 'Lieu proposé avec succès, en attente de validation',
      place: data[0]
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✅ APPROUVER UN LIEU (admin seulement)
router.put('/approve/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  try {
    const { data, error } = await supabase
      .from('places')
      .update({ is_approved: true })
      .eq('id', req.params.id)
      .select();

    if (error) return res.status(500).json({ message: error.message });

    res.json({ message: 'Lieu approuvé !', place: data[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✅ SUPPRIMER UN LIEU (admin seulement)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  try {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ message: error.message });

    res.json({ message: 'Lieu supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

module.exports = router;
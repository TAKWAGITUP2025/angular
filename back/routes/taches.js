const express = require('express');
const router = express.Router();
const Tache = require('../models/Tache');
const Projet = require('../models/Projet');

// GET /api/taches?projet=ID&statut=xxx&priorite=xxx -> liste + filtres
router.get('/', async (req, res, next) => {
  try {
    const { projet, statut, priorite } = req.query;
    const filtre = {};

    if (projet) filtre.projet = projet;
    if (statut) filtre.statut = statut;
    if (priorite) filtre.priorite = priorite;

    const taches = await Tache.find(filtre)
      .populate('projet', 'nom statut')
      .sort({ createdAt: -1 });
    res.json(taches);
  } catch (err) {
    next(err);
  }
});

// GET /api/taches/:id
router.get('/:id', async (req, res, next) => {
  try {
    const tache = await Tache.findById(req.params.id).populate('projet', 'nom statut');
    if (!tache) return res.status(404).json({ message: 'Tache introuvable' });
    res.json(tache);
  } catch (err) {
    next(err);
  }
});

// POST /api/taches -> creation
router.post('/', async (req, res, next) => {
  try {
    const { titre, projet } = req.body;
    if (!titre || !projet) {
      return res.status(400).json({ message: 'Titre et projet sont obligatoires' });
    }

    const p = await Projet.findById(projet);
    if (!p) return res.status(404).json({ message: 'Projet introuvable' });

    const tache = await Tache.create(req.body);
    const populated = await tache.populate('projet', 'nom statut');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

// PUT /api/taches/:id -> modification
router.put('/:id', async (req, res, next) => {
  try {
    const tache = await Tache.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('projet', 'nom statut');
    if (!tache) return res.status(404).json({ message: 'Tache introuvable' });
    res.json(tache);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/taches/:id -> suppression
router.delete('/:id', async (req, res, next) => {
  try {
    const tache = await Tache.findByIdAndDelete(req.params.id);
    if (!tache) return res.status(404).json({ message: 'Tache introuvable' });
    res.json({ message: 'Tache supprimee' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

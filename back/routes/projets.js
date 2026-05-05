const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const Tache = require('../models/Tache');

// GET /api/projets?search=xxx&statut=xxx -> liste + filtres + avancement
router.get('/', async (req, res, next) => {
  try {
    const { search, statut } = req.query;
    const filtre = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filtre.$or = [{ nom: regex }, { description: regex }, { responsable: regex }];
    }
    if (statut) filtre.statut = statut;

    const projets = await Projet.find(filtre).sort({ createdAt: -1 });

    // Calcul du pourcentage d'avancement pour chaque projet
    const projetsAvecAvancement = await Promise.all(
      projets.map(async (p) => {
        const total = await Tache.countDocuments({ projet: p._id });
        const terminees = await Tache.countDocuments({ projet: p._id, statut: 'termine' });
        const avancement = total === 0 ? 0 : Math.round((terminees / total) * 100);
        return { ...p.toObject(), avancement, totalTaches: total, tachesTerminees: terminees };
      })
    );

    res.json(projetsAvecAvancement);
  } catch (err) {
    next(err);
  }
});

// GET /api/projets/:id -> detail projet + taches
router.get('/:id', async (req, res, next) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) return res.status(404).json({ message: 'Projet introuvable' });

    const taches = await Tache.find({ projet: projet._id }).sort({ createdAt: -1 });
    const total = taches.length;
    const terminees = taches.filter((t) => t.statut === 'termine').length;
    const avancement = total === 0 ? 0 : Math.round((terminees / total) * 100);

    res.json({
      projet: { ...projet.toObject(), avancement, totalTaches: total, tachesTerminees: terminees },
      taches,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/projets -> creation
router.post('/', async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom du projet est obligatoire' });
    const projet = await Projet.create(req.body);
    res.status(201).json(projet);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projets/:id -> modification
router.put('/:id', async (req, res, next) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!projet) return res.status(404).json({ message: 'Projet introuvable' });
    res.json(projet);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projets/:id -> suppression (et ses taches)
router.delete('/:id', async (req, res, next) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) return res.status(404).json({ message: 'Projet introuvable' });
    await Tache.deleteMany({ projet: req.params.id });
    res.json({ message: 'Projet supprime' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const mongoose = require('mongoose');

// Schema d'un projet
const projetSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    statut: {
      type: String,
      enum: ['en attente', 'en cours', 'termine'],
      default: 'en attente',
    },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    responsable: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Projet', projetSchema);

const mongoose = require('mongoose');

// Schema d'une tache, liee a un projet
const tacheSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    statut: {
      type: String,
      enum: ['a faire', 'en cours', 'termine'],
      default: 'a faire',
    },
    priorite: {
      type: String,
      enum: ['basse', 'moyenne', 'haute'],
      default: 'moyenne',
    },
    projet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Projet',
      required: true,
    },
    dateLimit: { type: Date },
    assigneA: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tache', tacheSchema);

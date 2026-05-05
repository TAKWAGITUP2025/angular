// Script de donnees de demonstration
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Projet = require('./models/Projet');
const Tache = require('./models/Tache');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecte a MongoDB');

  await Projet.deleteMany({});
  await Tache.deleteMany({});
  await User.deleteMany({});
  console.log('Collections videes');

  // Comptes par defaut
  await User.insertMany([
    { username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin' },
    { username: 'chef', password: await bcrypt.hash('chef123', 10), role: 'chef' },
  ]);
  console.log('Utilisateurs crees (admin/admin123, chef/chef123)');

  const projets = await Projet.insertMany([
    {
      nom: 'Site E-commerce',
      description: "Developpement d'une boutique en ligne complete avec paiement en ligne",
      statut: 'en cours',
      dateDebut: new Date('2024-01-15'),
      dateFin: new Date('2024-06-30'),
      responsable: 'Alice Martin',
    },
    {
      nom: 'Application Mobile',
      description: 'Application iOS et Android pour les clients avec notifications push',
      statut: 'en attente',
      dateDebut: new Date('2024-03-01'),
      dateFin: new Date('2024-12-31'),
      responsable: 'Bob Dupont',
    },
    {
      nom: 'Refonte SI Interne',
      description: "Modernisation du systeme d'information interne de l'entreprise",
      statut: 'termine',
      dateDebut: new Date('2023-06-01'),
      dateFin: new Date('2024-01-31'),
      responsable: 'Claire Leroy',
    },
  ]);
  console.log(projets.length + ' projets crees');

  await Tache.insertMany([
    // ---- Projet 1 : Site E-commerce ----
    {
      titre: 'Maquettes UI/UX',
      description: 'Creation des maquettes Figma pour toutes les pages',
      statut: 'termine',
      priorite: 'haute',
      projet: projets[0]._id,
      dateLimit: new Date('2024-02-01'),
      assigneA: 'Alice Martin',
    },
    {
      titre: 'Developpement frontend',
      description: 'Integration HTML/CSS/JS des maquettes validees',
      statut: 'en cours',
      priorite: 'haute',
      projet: projets[0]._id,
      dateLimit: new Date('2024-04-30'),
      assigneA: 'Kevin Dev',
    },
    {
      titre: 'Integration paiement Stripe',
      description: 'Integration Stripe et configuration des webhooks',
      statut: 'a faire',
      priorite: 'haute',
      projet: projets[0]._id,
      dateLimit: new Date('2024-05-31'),
      assigneA: 'Kevin Dev',
    },
    {
      titre: 'Tests et recette',
      description: 'Tests fonctionnels, correctifs et validation finale',
      statut: 'a faire',
      priorite: 'moyenne',
      projet: projets[0]._id,
      dateLimit: new Date('2024-06-15'),
      assigneA: 'Alice Martin',
    },
    // ---- Projet 2 : Application Mobile ----
    {
      titre: 'Analyse des besoins',
      description: 'Ateliers de recueil des besoins avec les parties prenantes',
      statut: 'termine',
      priorite: 'haute',
      projet: projets[1]._id,
      dateLimit: new Date('2024-03-31'),
      assigneA: 'Bob Dupont',
    },
    {
      titre: 'Prototype React Native',
      description: "Developpement du prototype de l'application mobile",
      statut: 'a faire',
      priorite: 'moyenne',
      projet: projets[1]._id,
      dateLimit: new Date('2024-06-30'),
      assigneA: 'Sara Dev',
    },
    {
      titre: 'Integration API backend',
      description: 'Connexion de l\'app mobile aux APIs REST',
      statut: 'a faire',
      priorite: 'basse',
      projet: projets[1]._id,
      dateLimit: new Date('2024-09-30'),
      assigneA: 'Sara Dev',
    },
    // ---- Projet 3 : Refonte SI Interne ----
    {
      titre: 'Audit systeme existant',
      description: 'Audit complet du systeme actuel et rapport de recommandations',
      statut: 'termine',
      priorite: 'haute',
      projet: projets[2]._id,
      dateLimit: new Date('2023-07-31'),
      assigneA: 'Claire Leroy',
    },
    {
      titre: 'Migration base de donnees',
      description: 'Migration vers PostgreSQL avec validation des donnees',
      statut: 'termine',
      priorite: 'haute',
      projet: projets[2]._id,
      dateLimit: new Date('2023-10-31'),
      assigneA: 'Tom DBA',
    },
    {
      titre: 'Formation utilisateurs',
      description: 'Sessions de formation pour toutes les equipes',
      statut: 'termine',
      priorite: 'moyenne',
      projet: projets[2]._id,
      dateLimit: new Date('2024-01-15'),
      assigneA: 'Claire Leroy',
    },
  ]);
  console.log('Taches creees');

  await mongoose.disconnect();
  console.log('Termine');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

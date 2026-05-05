// Point d'entree de l'API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const projetsRoutes = require('./routes/projets');
const tachesRoutes = require('./routes/taches');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projets', auth, projetsRoutes);
app.use('/api/taches', auth, tachesRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'API Gestion de projets et taches' });
});

// Gestion d'erreurs simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

// Connexion MongoDB puis demarrage du serveur
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connecte');
    app.listen(PORT, () => {
      console.log('Serveur lance sur http://localhost:' + PORT);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });

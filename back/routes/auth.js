const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register -> creer un compte
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username et password requis' });
    }

    const exist = await User.findOne({ username });
    if (exist) return res.status(400).json({ message: 'Utilisateur deja existant' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role: role || 'admin' });
    res.status(201).json({
      message: 'Utilisateur cree',
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login -> retourne un token JWT
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Identifiants invalides' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({
      token,
      user: { _id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

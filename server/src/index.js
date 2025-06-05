require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initDb } = require('./db');
const User = require('./models/user');

async function start() {
  await initDb();

  const app = express();
  app.use(express.json());

  app.post('/register', async (req, res) => {
    const { username, email, password, apiKey } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password required' });
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      await User.create({ username, email, password_hash: hash, api_key: apiKey || null });
      res.status(201).json({ message: 'user created' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'failed to create user' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'login failed' });
    }
  });

  function authMiddleware(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'missing token' });
    }
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.userId;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'invalid token' });
    }
  }

  app.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findByPk(req.userId, { attributes: ['username', 'email', 'api_key'] });
      if (!user) {
        return res.status(404).json({ error: 'user not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'failed to fetch user' });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : undefined;
app.use(
  cors(
    allowedOrigins
      ? {
          origin: allowedOrigins,
        }
      : undefined
  )
);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function init() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    api_key TEXT
  );`);
}

init().catch(err => {
  console.error('Failed to init DB', err);
  process.exit(1);
});

app.post('/register', async (req, res) => {
  const { username, email, password, apiKey } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash, api_key) VALUES ($1, $2, $3, $4)',
      [username, email, hash, apiKey || null]
    );
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
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
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
    const { rows } = await pool.query('SELECT username, email, api_key FROM users WHERE id=$1', [req.userId]);
    const user = rows[0];
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

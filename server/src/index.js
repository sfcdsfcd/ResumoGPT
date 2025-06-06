require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const OpenAI = require('openai')


const { initDb } = require('./db')
const User = require('./models/user')

async function start() {
  await initDb()
  const app = express()
  app.use(express.json())
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : undefined
  app.use(
    cors(
      allowedOrigins
        ? {
          origin: allowedOrigins,
        }
        : undefined
    )
  )

  app.post('/register', async (req, res) => {
    const { username, email, password, apiKey } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password required' })
    }
    try {
      const hash = await bcrypt.hash(password, 10)
      await User.create({ username, email, password_hash: hash, api_key: apiKey || null })
      res.status(201).json({ message: 'user created' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'failed to create user' })
    }
  })

  app.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'invalid credentials' })
      }
      const valid = await bcrypt.compare(password, user.password_hash)
      if (!valid) {
        return res.status(401).json({ error: 'invalid credentials' })
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'login failed' })
    }
  })

  function authMiddleware(req, res, next) {
    const auth = req.headers['authorization']
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'missing token' })
    }
    const token = auth.slice(7)
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = payload.userId
      next()
    } catch (err) {
      return res.status(401).json({ error: 'invalid token' })
    }
  }

  app.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findByPk(req.userId, { attributes: ['username', 'email', 'api_key'] })
      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      }
      res.json(user)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'failed to fetch user' })
    }
  })

  app.post('/me/api-key', authMiddleware, async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'apiKey required' });
    }
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'user not found' });
      }
      user.api_key = apiKey;
      await user.save();
      res.json({ message: 'API Key updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'failed to update API Key' });
    }
  });

  app.post('/resumir', authMiddleware, async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'texto obrigatório' });
    }
    try {
      const user = await User.findByPk(req.userId);
      if (!user || !user.api_key) {
        return res.status(400).json({ error: 'API key não configurada' });
      }
      const client = new OpenAI({ apiKey: user.api_key });
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Resuma o texto a seguir em até 5 frases.' },
          { role: 'user', content: text }
        ]
      });
      const resumo = completion.choices?.[0]?.message?.content?.trim() || '';
      res.json({ resumo });
    } catch (err) {
      console.error('resumir failed', err);
      res.status(500).json({ error: 'falha ao resumir' });
    }
  });

  app.post('/summarize', authMiddleware, async (req, res) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }
    try {
      const user = await User.findByPk(req.userId);
      if (!user || !user.api_key) {
        return res.status(400).json({ error: 'API key not configured' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.api_key}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Resuma o seguinte texto:\n\n${text}` }]
        })
      });
      if (!response.ok) {
        const t = await response.text();
        console.error('OpenAI error', response.status, t);
        return res.status(500).json({ error: 'openai failed' });
      }
      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content || '';
      res.json({ summary });
    } catch (err) {
      console.error('summarize failed', err);
      res.status(500).json({ error: 'summarize failed' });
    }
  });

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

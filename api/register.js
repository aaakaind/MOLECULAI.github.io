import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// WARNING: In-memory storage is for DEMO purposes only
// In serverless environments, data will NOT persist across function invocations
// For production, replace with a database (e.g., PostgreSQL, MongoDB, Redis)
// Each Vercel function cold start will reset this Map
const users = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * User registration endpoint
 * POST /api/register
 * 
 * NOTE: This implementation uses in-memory storage which does NOT persist
 * in serverless environments. User data will be lost on function cold starts.
 * For production use, integrate a database.
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (users.has(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(username, {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      token, 
      username,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

import jwt from 'jsonwebtoken';

// WARNING: In-memory storage is for DEMO purposes only
// In serverless environments, data will NOT persist across function invocations
// Saved visualizations will be lost on cold starts
// For production, replace with a database (e.g., PostgreSQL, MongoDB, Redis)
const savedVisualizations = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * Authenticate JWT token
 */
function authenticateToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Visualizations API endpoint
 * GET /api/visualizations - Get user's visualizations
 * POST /api/visualizations - Save a new visualization
 * DELETE /api/visualizations?id=xxx - Delete a visualization
 * 
 * NOTE: This implementation uses in-memory storage which does NOT persist
 * in serverless environments. Data will be lost on function cold starts.
 * For production use, integrate a database.
 */
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authenticate user
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = authenticateToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  try {
    // GET - Retrieve user's visualizations
    if (req.method === 'GET') {
      const userVisualizations = Array.from(savedVisualizations.values())
        .filter(v => v.username === user.username);
      return res.status(200).json(userVisualizations);
    }

    // POST - Save new visualization
    if (req.method === 'POST') {
      const { name, moleculeId, settings } = req.body;
      
      if (!name || !moleculeId) {
        return res.status(400).json({ error: 'Name and molecule ID required' });
      }

      const visualization = {
        id: Date.now().toString(),
        username: user.username,
        name,
        moleculeId,
        settings: settings || {},
        createdAt: new Date().toISOString()
      };

      savedVisualizations.set(visualization.id, visualization);
      return res.status(201).json(visualization);
    }

    // DELETE - Remove a visualization
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Visualization ID required' });
      }

      const visualization = savedVisualizations.get(id);
      
      if (!visualization) {
        return res.status(404).json({ error: 'Visualization not found' });
      }

      if (visualization.username !== user.username) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      savedVisualizations.delete(id);
      return res.status(200).json({ success: true, message: 'Visualization deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Visualizations API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

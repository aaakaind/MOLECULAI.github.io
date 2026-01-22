import moleculeServer from '../mcp-server/molecules-server.js';

/**
 * Molecules API endpoint for Vercel
 * Handles various molecule-related requests
 */
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { id, search, elements } = req.query;
    
    // Search molecules
    if (search) {
      const results = moleculeServer.searchMolecules(search);
      return res.status(200).json(results);
    }
    
    // Get elements for a specific molecule
    if (id && elements === 'true') {
      const elementsData = moleculeServer.getElementsInMolecule(id);
      if (!elementsData) {
        return res.status(404).json({ error: 'Molecule not found' });
      }
      return res.status(200).json(elementsData);
    }
    
    // Get specific molecule
    if (id) {
      const molecule = moleculeServer.getMolecule(id);
      if (!molecule) {
        return res.status(404).json({ error: 'Molecule not found' });
      }
      return res.status(200).json(molecule);
    }
    
    // Get all molecules
    const molecules = moleculeServer.getAllMolecules();
    res.status(200).json(molecules);
  } catch (error) {
    console.error('Error in molecules API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

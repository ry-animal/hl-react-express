import express from 'express';
import { getBreweries, searchBreweries } from '../services/breweryDbService';

const router = express.Router();

// GET /api/breweries - Get all breweries with optional filters
router.get('/', async (req, res) => {
  try {
    const breweries = await getBreweries(req.query);
    res.json(breweries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch breweries' });
  }
});

export default router;
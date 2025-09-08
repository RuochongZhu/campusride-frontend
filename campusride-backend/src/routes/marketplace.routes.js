import express from 'express';
import { 
  createItem, 
  getItems, 
  getItemById, 
  updateItem, 
  deleteItem,
  getMyItems,
  favoriteItem,
  unfavoriteItem,
  getMyFavorites,
  searchItems
} from '../controllers/marketplace.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All marketplace routes require authentication
router.use(authenticateToken);

// Items management
// POST /api/v1/marketplace/items
router.post('/items', asyncHandler(createItem));

// GET /api/v1/marketplace/items - List/search items
router.get('/items', asyncHandler(getItems));

// GET /api/v1/marketplace/items/search
router.get('/items/search', asyncHandler(searchItems));

// GET /api/v1/marketplace/items/:id
router.get('/items/:id', asyncHandler(getItemById));

// PUT /api/v1/marketplace/items/:id
router.put('/items/:id', asyncHandler(updateItem));

// DELETE /api/v1/marketplace/items/:id
router.delete('/items/:id', asyncHandler(deleteItem));

// My items
// GET /api/v1/marketplace/my-items
router.get('/my-items', asyncHandler(getMyItems));

// Favorites management
// POST /api/v1/marketplace/items/:id/favorite
router.post('/items/:id/favorite', asyncHandler(favoriteItem));

// DELETE /api/v1/marketplace/items/:id/favorite
router.delete('/items/:id/favorite', asyncHandler(unfavoriteItem));

// GET /api/v1/marketplace/favorites
router.get('/favorites', asyncHandler(getMyFavorites));

export default router; 
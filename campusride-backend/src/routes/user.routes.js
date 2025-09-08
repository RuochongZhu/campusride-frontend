import express from 'express';
import { getProfile, updateProfile, getUserById, batchGetUsers } from '../controllers/user.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/v1/users/profile
router.get('/profile', asyncHandler(getProfile));

// PUT /api/v1/users/profile
router.put('/profile', asyncHandler(updateProfile));

// GET /api/v1/users/:id - For internal use by other modules
router.get('/:id', asyncHandler(getUserById));

// POST /api/v1/users/batch - For batch queries (leaderboard, etc.)
router.post('/batch', asyncHandler(batchGetUsers));

export default router; 
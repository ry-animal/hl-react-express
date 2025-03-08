import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../controllers/userController';

const router = Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);

export default router; 
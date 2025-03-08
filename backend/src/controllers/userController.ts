import { Request, Response } from 'express';
import { getDb } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm/expressions';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allUsers = await db.select().from(users);
    
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    
    const user = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    
    if (!user.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    
    const db = await getDb();
    
    const newUser = await db.insert(users).values({
      name,
      email,
    }).returning();
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}; 
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { login, profile, signup } from '../service/user';

const router = Router();

// signup router
router.post('/signup', (req, res) => signup(req, res));

// login router
router.post('/login', (req, res) => login(req, res));

// user profile
router.get('/profile', auth, (req, res) => profile(req, res));

export default router;

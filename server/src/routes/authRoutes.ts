import express from 'express';
import {
  registerUser,
  registerStation,
  loginUser,
  loginStation,
  logout,
  validateToken,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/station', registerStation);
router.post('/login/user', loginUser);
router.post('/login/station', loginStation);
router.post('/logout/user', logout);
router.post('/logout/station', logout);
router.post('/validate-token', validateToken);

export default router;

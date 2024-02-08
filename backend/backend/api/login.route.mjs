import express from 'express';
const router = express.Router();
import { login } from './login.controller.js';

router.post('/', login);

export default router;

import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json()); // habilita JSON
app.use('/api/auth', authRoutes); // agrupa rotas de autenticação

export default app;

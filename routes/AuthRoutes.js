// Backend/routes/AuthRoutes.js
import { Router } from 'express'
import { login, register } from '../controllers/AuthController.sequelize.js'

const router = Router()

// Cadastro de usuário
router.post('/register', register)   // POST http://localhost:3000/api/auth/register

// Login de usuário
router.post('/login', login)         // POST http://localhost:3000/api/auth/login

export default router

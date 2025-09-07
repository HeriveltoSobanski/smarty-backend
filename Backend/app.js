// Backend/app.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/AuthRoutes.js'
import usuariosRoutes from './routes/UsuariosRoutes.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuariosRoutes)

// (opcional) healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// 404 por último
app.use((_req, res) => res.status(404).json({ erro: true, mensagem: 'Rota não encontrada.' }))

export default app

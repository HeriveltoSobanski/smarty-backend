// Backend/routes/UsuariosRoutes.js
import { Router } from 'express'
import * as UsuariosController from '../controllers/UsuariosController.sequelize.js'

const router = Router()

// Listar todos os usuários
router.get('/', UsuariosController.listar)             // GET http://localhost:3000/api/usuarios

// Obter um usuário pelo ID
router.get('/:id', UsuariosController.obter)           // GET http://localhost:3000/api/usuarios/:id

// Criar novo usuário
router.post('/', UsuariosController.criar)             // POST http://localhost:3000/api/usuarios

// Atualizar usuário existente
router.put('/:id', UsuariosController.atualizar)       // PUT http://localhost:3000/api/usuarios/:id

// Remover usuário
router.delete('/:id', UsuariosController.remover)      // DELETE http://localhost:3000/api/usuarios/:id

export default router

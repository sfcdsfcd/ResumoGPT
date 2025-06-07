import { Router } from 'express'
import { resumoController } from '../controllers/resumo.controller'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

router.post('/resumir', authMiddleware, (req, res, next) => resumoController.resumir(req, res, next))
router.post('/summarize', authMiddleware, (req, res, next) => resumoController.summarize(req, res, next))

export default router

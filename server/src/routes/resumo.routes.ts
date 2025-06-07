import { Router } from 'express'
import { resumoController } from '../controllers/resumo.controller'

const router = Router()

router.post('/resumir', (req, res, next) => resumoController.resumir(req, res, next))

export default router

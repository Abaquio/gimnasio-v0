import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { listClients } from '../services/clients.service.js'
import { createClientWithMembership } from '../services/clients.service.js'
import { createClientSchema } from '../schemas/clients.schema.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const {
    search = '',
    status,
    limit = '20',
    offset = '0',
    orderBy = 'nombre',
    orderDir = 'asc'
  } = req.query

  const result = await listClients({
    search,
    status,
    limit: Number(limit),
    offset: Number(offset),
    orderBy,
    orderDir
  })
  res.json(result)
}))

router.post('/', asyncHandler(async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: parsed.error.flatten().fieldErrors
    })
  }

  const result = await createClientWithMembership(parsed.data)
  res.status(201).json(result)
}))

export default router
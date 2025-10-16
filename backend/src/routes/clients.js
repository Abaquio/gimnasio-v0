// backend/src/routes/clients.js
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  listClients,
  createClientWithMembership,
  getClientById,
  updateClient,
} from '../services/clients.service.js'
import { createClientSchema } from '../schemas/clients.schema.js'


const router = Router()

// GET /api/v1/clients
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      search = '',
      status,
      limit = '20',
      offset = '0',
      orderBy = 'nombre',
      orderDir = 'asc',
    } = req.query

    const data = await listClients({
      search,
      status,
      limit: Number(limit),
      offset: Number(offset),
      orderBy,
      orderDir,
    })

    res.json(data) // { items, total }
  })
)

// NUEVO: GET /api/v1/clients/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await getClientById(id)
    res.json(data)
  })
)

// POST /api/v1/clients
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = createClientSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validación fallida',
        details: parsed.error.flatten().fieldErrors,
      })
    }
    const result = await createClientWithMembership(parsed.data)
    res.status(201).json(result)
  })
)

// NUEVO: PUT /api/v1/clients/:id (actualiza nombre/correo/telefono)
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    // Validación mínima para no tocar schemas existentes
    const { nombre, correo, telefono } = req.body ?? {}
    if (
      typeof nombre !== 'string' ||
      typeof correo !== 'string' ||
      typeof telefono !== 'string' ||
      !nombre.trim() ||
      !correo.trim() ||
      !telefono.trim()
    ) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }
    const result = await updateClient(id, { nombre, correo, telefono })
    res.json(result)
  })
)
// POST /api/v1/clients/:id/renew
router.post('/:id/renew', async (req, res, next) => {
  try {
    const { id } = req.params
    const { months, paymentMethod, amountClp } = req.body
    const out = await renewMembership(id, {
      months: Number(months),
      paymentMethod,
      amountClp: amountClp != null ? Number(amountClp) : undefined,
    })
    res.status(201).json(out)
  } catch (err) {
    next(err)
  }
})

export default router
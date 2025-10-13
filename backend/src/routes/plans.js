import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { listPlans } from '../services/plans.service.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const plans = await listPlans()
  res.json({ items: plans })
}))

export default router
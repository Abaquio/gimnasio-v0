import { Router } from 'express'
import os from 'os'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  })
})

export default router
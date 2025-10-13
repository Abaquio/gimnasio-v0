import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import healthRouter from './routes/health.js'
import plansRouter from './routes/plans.js'
// ...

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Prefijo de API
const API_PREFIX = '/api/v1'

// Rutas
app.use(API_PREFIX, healthRouter)

// 404 por defecto
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Arranque
app.listen(env.PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${env.PORT}${API_PREFIX}`)
})

// Handler de errores
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status ?? 500
  res.status(status).json({
    error: err.message ?? 'Internal Server Error'
  })
})


app.use(API_PREFIX + '/plans', plansRouter)
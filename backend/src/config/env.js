import 'dotenv/config'
import { z } from 'zod'

// helper: trata "" como undefined
const emptyToUndefined = (schema) =>
  z.union([schema, z.literal('')]).transform((v) => (v === '' ? undefined : v))

const schema = z.object({
  PORT: z.coerce.number().default(4000),

  // Aún no las exigimos; permitimos vacío mientras no conectamos a Supabase
  SUPABASE_URL: emptyToUndefined(z.string().url()).optional(),
  SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(z.string()).optional(),
})

export const env = schema.parse(process.env)
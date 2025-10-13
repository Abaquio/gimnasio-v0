import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Correo inválido'),
  phone: z.string().min(5, 'Teléfono requerido'),

  membershipStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  membershipEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),

  // Uno de los dos:
  planId: z.number().int().positive().optional(),
  monthsOverride: z.coerce.number().int().positive().optional(),

  priceClp: z.coerce.number().int().positive('Precio inválido'),
  paymentMethod: z.enum(['efectivo', 'transferencia', 'debito', 'credito'])
})
.refine((v) => v.planId || v.monthsOverride, {
  message: 'Debes elegir un plan o definir meses personalizados',
  path: ['planId']
})
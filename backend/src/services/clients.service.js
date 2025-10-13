import { supabase } from '../lib/supabase.js'
import { HttpError } from '../utils/httpError.js'

export async function createClientWithMembership(payload) {
  // 1) Crear cliente
  const { data: cData, error: cErr } = await supabase
    .from('cliente')
    .insert({
      nombre: payload.name,
      correo: payload.email,
      telefono: payload.phone,
      fecha_ingreso: payload.membershipStart
    })
    .select('id')
    .single()

  if (cErr) {
    console.error('[supabase] create client:', cErr)
    throw new HttpError(500, 'No se pudo crear el cliente')
  }

  const clienteId = cData.id

  // 2) Renovar/crear período inicial vía RPC
  const { data: rpcData, error: rpcErr } = await supabase.rpc('renew_membership_flexible', {
    p_cliente_id: clienteId,
    p_plan_id: payload.planId ?? null,
    p_months_override: payload.monthsOverride ?? null,
    p_precio_clp: payload.priceClp,
    p_method: payload.paymentMethod
  })

  if (rpcErr) {
    console.error('[supabase] renew_membership_flexible:', rpcErr)
    // rollback cliente si quieres ser estricto
    throw new HttpError(500, 'No se pudo registrar la membresía inicial')
  }

  return {
    clienteId,
    periodId: rpcData // la función devuelve UUID del período
  }
}
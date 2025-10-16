// backend/src/services/clients.service.js
import { supabase } from '../lib/supabase.js'
import { HttpError } from '../utils/httpError.js'

// ---------- EXISTENTE ----------
function computeStatus(endDateStr) {
  if (!endDateStr) return 'sin_membresia'
  const today = new Date()
  const end = new Date(endDateStr)
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'vencido'
  if (diff <= 7) return 'por_vencer'
  return 'vigente'
}

export async function listClients({
  search = '',
  status,
  limit = 20,
  offset = 0,
  orderBy = 'nombre',
  orderDir = 'asc',
}) {
  let q = supabase
    .from('cliente')
    .select('id, nombre, correo, telefono', { count: 'exact' })
    .order(orderBy, { ascending: orderDir === 'asc' })
    .range(offset, offset + limit - 1)

  if (search) {
    const s = `%${search}%`
    q = q.or(`nombre.ilike.${s},correo.ilike.${s},telefono.ilike.${s}`)
  }

  const { data: clients, error: cErr } = await q
  if (cErr) {
    console.error('[listClients] cliente error:', cErr)
    throw new HttpError(500, 'No se pudo listar clientes')
  }
  if (!clients?.length) return { items: [], total: 0 }

  const ids = clients.map((c) => c.id)

  const { data: periods, error: pErr } = await supabase
    .from('membership_period')
    .select('cliente_id, end_date')
    .in('cliente_id', ids)
    .order('end_date', { ascending: false })

  if (pErr) {
    console.error('[listClients] membership_period error:', pErr)
    throw new HttpError(500, 'No se pudieron obtener períodos de membresía')
  }

  const latestByClient = new Map()
  for (const row of periods ?? []) {
    if (!latestByClient.has(row.cliente_id)) {
      latestByClient.set(row.cliente_id, row.end_date)
    }
  }

  let items = clients.map((c) => {
    const endDate = latestByClient.get(c.id) || null
    const estado = computeStatus(endDate)
    return {
      cliente_id: c.id,
      nombre: c.nombre,
      correo: c.correo,
      telefono: c.telefono,
      end_date: endDate,
      estado,
    }
  })

  if (status) {
    const k = String(status).toLowerCase()
    items = items.filter((it) => it.estado === k)
  }

  return { items, total: items.length }
}

/**
 * Crea cliente + membresía inicial (ya lo tenías)
 */
export async function createClientWithMembership(payload) {
  const { data: cData, error: cErr } = await supabase
    .from('cliente')
    .insert({
      nombre: payload.name,
      correo: payload.email,
      telefono: payload.phone,
      fecha_ingreso: payload.membershipStart,
    })
    .select('id')
    .single()

  if (cErr) {
    console.error('[createClientWithMembership] cliente insert error:', cErr)
    throw new HttpError(500, 'No se pudo crear el cliente')
  }

  const { data: rpcData, error: rpcErr } = await supabase.rpc(
    'renew_membership_flexible',
    {
      p_cliente_id: cData.id,
      p_plan_id: payload.planId ?? null,
      p_months_override: payload.monthsOverride ?? null,
      p_precio_clp: payload.priceClp,
      p_method: payload.paymentMethod,
    }
  )

  if (rpcErr) {
    console.error('[createClientWithMembership] rpc error:', rpcErr)
    throw new HttpError(500, 'No se pudo registrar la membresía inicial')
  }

  return { clienteId: cData.id, periodId: rpcData }
}

// ---------- NUEVO: obtener 1 cliente ----------
export async function getClientById(id) {
  const { data: c, error } = await supabase
    .from('cliente')
    .select('id, nombre, correo, telefono')
    .eq('id', id)
    .single()

  if (error || !c) throw new HttpError(404, 'Cliente no encontrado')

  const { data: lastPeriod, error: pErr } = await supabase
    .from('membership_period')
    .select('start_date, end_date')
    .eq('cliente_id', id)
    .order('end_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  const end = lastPeriod?.end_date ?? null
  const estado = computeStatus(end)

  return {
    id: c.id,
    nombre: c.nombre,
    correo: c.correo,
    telefono: c.telefono,
    membership: lastPeriod
      ? { start_date: lastPeriod.start_date, end_date: lastPeriod.end_date, estado }
      : { start_date: null, end_date: null, estado: 'sin_membresia' },
  }
}

// ---------- NUEVO: actualizar datos básicos ----------
export async function updateClient(id, { nombre, correo, telefono }) {
  const { data, error } = await supabase
    .from('cliente')
    .update({ nombre, correo, telefono })
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    console.error('[updateClient] error:', error)
    throw new HttpError(500, 'No se pudo actualizar el cliente')
  }
  return { id: data.id }
}

// ---------- NUEVO: renovar / pagar por adelantado ----------
/**
 * Renovación flexible:
 * - months: número de meses a agregar (>=1)
 * - paymentMethod: 'efectivo' | 'transferencia' | 'debito' | 'credito'
 * - amountClp: opcional; si no viene, el RPC calcula con el plan.
 * - planId: opcional; si viene, el RPC usa ese plan. Si no, usa lógica por defecto.
 *
 * Devuelve el id del nuevo período (y/o lo que retorne el RPC).
 */
export async function renewMembership(
  clienteId,
  { months = 1, paymentMethod = 'efectivo', amountClp = null, planId = null } = {}
) {
  if (!clienteId) throw new HttpError(400, 'clienteId requerido')
  if (!months || Number(months) <= 0) throw new HttpError(400, 'months inválido')

  const { data: rpcData, error: rpcErr } = await supabase.rpc(
    'renew_membership_flexible',
    {
      p_cliente_id: clienteId,
      p_plan_id: planId,
      p_months_override: Number(months),
      p_precio_clp: amountClp,     // puede ser null -> el RPC calcula
      p_method: paymentMethod,
    }
  )

  if (rpcErr) {
    console.error('[renewMembership] rpc error:', rpcErr)
    throw new HttpError(500, 'No se pudo registrar la renovación')
  }

  // opcionalmente podrías recalcular estado y devolverlo:
  try {
    const { data: last, error: lpErr } = await supabase
      .from('membership_period')
      .select('end_date')
      .eq('cliente_id', clienteId)
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle()
    const estado = computeStatus(last?.end_date ?? null)
    return { periodId: rpcData, estado, end_date: last?.end_date ?? null }
  } catch {
    return { periodId: rpcData }
  }
}
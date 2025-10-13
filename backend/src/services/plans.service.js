import { supabase } from '../lib/supabase.js'
import { HttpError } from '../utils/httpError.js'

export async function listPlans() {
  const { data, error } = await supabase
    .from('plan')
    .select('id, nombre, meses, precio_clp')
    .order('meses', { ascending: true })
  if (error) {
    console.error('[supabase] listPlans:', error)
    throw new HttpError(500, 'Error al obtener planes')
  }
  return data
}
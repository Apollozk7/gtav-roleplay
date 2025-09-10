import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/Sao_Paulo' // Horário de Brasília

export const formatBrazilDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const zonedDate = toZonedTime(parsedDate, TIMEZONE)
  return format(zonedDate, 'dd/MM/yyyy HH:mm:ss')
}

export const formatBrazilDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const zonedDate = toZonedTime(parsedDate, TIMEZONE)
  return format(zonedDate, 'dd/MM/yyyy')
}

export const formatBrazilTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const zonedDate = toZonedTime(parsedDate, TIMEZONE)
  return format(zonedDate, 'HH:mm:ss')
}

export const formatForDateTimeLocal = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm")
}

export const getCurrentBrazilTime = (): Date => {
  const now = new Date()
  return toZonedTime(now, TIMEZONE)
}

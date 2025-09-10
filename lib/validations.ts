import { z } from 'zod'

// Validações de usuário
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username deve conter apenas letras, números e underscore'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
  cashTapUser: z.string()
    .min(3, 'CashTap User deve ter pelo menos 3 caracteres')
    .max(20, 'CashTap User deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'CashTap User deve conter apenas letras, números e underscore')
})

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email ou username é obrigatório')
    .max(100, 'Email ou username muito longo'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha muito longa')
})

// Validações de eventos
export const eventSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  type: z.enum(['CORRIDA', 'ARRANCADA', 'TOUGE', 'CAR_MEET', 'TAKEOVER'], {
    errorMap: () => ({ message: 'Tipo de evento inválido' })
  }),
  location: z.string()
    .min(3, 'Localização deve ter pelo menos 3 caracteres')
    .max(200, 'Localização deve ter no máximo 200 caracteres')
    .optional(),
  locationRevealTime: z.string()
    .datetime('Data de revelação inválida')
    .optional(),
  startTime: z.string()
    .datetime('Data de início inválida'),
  endTime: z.string()
    .datetime('Data de fim inválida')
    .optional()
})

// Validações de apostas
export const betSchema = z.object({
  eventId: z.string()
    .min(1, 'ID do evento é obrigatório'),
  participantId: z.string()
    .min(1, 'ID do participante é obrigatório'),
  amount: z.number()
    .min(1000, 'Valor mínimo da aposta é $1.000')
    .max(1000000, 'Valor máximo da aposta é $1.000.000'),
  potentialWin: z.number()
    .min(1000, 'Ganho potencial mínimo é $1.000')
    .max(10000000, 'Ganho potencial máximo é $10.000.000'),
  proofLink: z.string()
    .url('Link de comprovante inválido')
    .optional()
})

export const userBetSchema = betSchema.extend({
  proofLink: z.string()
    .url('Link de comprovante inválido')
    .min(1, 'Comprovante é obrigatório para usuários')
})

// Validações de serviços
export const serviceSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  type: z.enum(['TRANSPORT', 'THEFT', 'DISTRACTION', 'OTHER'], {
    errorMap: () => ({ message: 'Tipo de serviço inválido' })
  }),
  price: z.number()
    .min(0, 'Preço não pode ser negativo')
    .max(1000000, 'Preço máximo é $1.000.000')
    .optional(),
  isActive: z.boolean().optional()
})

// Validações de solicitações de serviço
export const serviceRequestSchema = z.object({
  serviceId: z.string()
    .min(1, 'ID do serviço é obrigatório'),
  message: z.string()
    .max(500, 'Mensagem deve ter no máximo 500 caracteres')
    .optional()
})

// Validações de participantes
export const participantSchema = z.object({
  codename: z.string()
    .min(2, 'Codename deve ter pelo menos 2 caracteres')
    .max(50, 'Codename deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_\s]+$/, 'Codename deve conter apenas letras, números, underscore e espaços'),
  odds: z.number()
    .min(1.0, 'Odds mínima é 1.0')
    .max(100.0, 'Odds máxima é 100.0')
})

// Validações de contatos
export const contactSchema = z.object({
  type: z.enum(['PHONE', 'EMAIL', 'TELEGRAM', 'DISCORD', 'WHATSAPP', 'OTHER'], {
    errorMap: () => ({ message: 'Tipo de contato inválido' })
  }),
  label: z.string()
    .min(2, 'Label deve ter pelo menos 2 caracteres')
    .max(50, 'Label deve ter no máximo 50 caracteres'),
  value: z.string()
    .min(3, 'Valor deve ter pelo menos 3 caracteres')
    .max(200, 'Valor deve ter no máximo 200 caracteres'),
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  isActive: z.boolean().optional()
})

// Função para sanitizar strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Função para validar e sanitizar dados
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => err.message).join(', ')
    throw new Error(`Validação falhou: ${errors}`)
  }
  
  return result.data
}

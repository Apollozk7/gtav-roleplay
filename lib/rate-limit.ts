import { NextRequest, NextResponse } from 'next/server'

// Simples rate limiting em memória (para produção, use Redis)
const requests = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Janela de tempo em ms
  maxRequests: number // Máximo de requests por janela
  message?: string // Mensagem de erro
  skipSuccessfulRequests?: boolean // Pular requests bem-sucedidos
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    maxRequests = 100,
    message = 'Muitas tentativas, tente novamente mais tarde',
    // skipSuccessfulRequests = false
  } = options

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    // const windowStart = now - windowMs

    // Limpar entradas expiradas
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < now) {
        requests.delete(key)
      }
    }

    // Obter ou criar entrada para este IP
    let ipData = requests.get(ip)
    if (!ipData || ipData.resetTime < now) {
      ipData = { count: 0, resetTime: now + windowMs }
      requests.set(ip, ipData)
    }

    // Verificar se excedeu o limite
    if (ipData.count >= maxRequests) {
      return NextResponse.json(
        { error: message },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((ipData.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(ipData.resetTime).toISOString()
          }
        }
      )
    }

    // Incrementar contador
    ipData.count++

    return null // Continuar com a requisição
  }
}

// Rate limits específicos para diferentes endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 tentativas de login por 15 minutos
  message: 'Muitas tentativas de login, tente novamente em 15 minutos'
})

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // 100 requests por 15 minutos
  message: 'Muitas requisições, tente novamente em 15 minutos'
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 10, // 10 requests por minuto
  message: 'Muitas requisições, aguarde 1 minuto'
})

// Função para aplicar rate limiting em rotas
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimiter(request)
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  return handler()
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { userBetSchema, validateAndSanitize } from '@/lib/validations'
import { withRateLimit, apiRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  return withRateLimit(request, apiRateLimit, async () => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session) {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 401 }
        )
      }

      const body = await request.json()
      
      // Validar e sanitizar dados
      const { eventId, participantId, amount, potentialWin, proofLink } = validateAndSanitize(userBetSchema, body)

    const bet = await prisma.bet.create({
      data: {
        eventId,
        participantId,
        userId: session.user.id,
        amount: parseFloat(amount),
        potentialWin: parseFloat(potentialWin),
        proofLink
      }
    })

    return NextResponse.json(bet, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar aposta do usuário:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
}



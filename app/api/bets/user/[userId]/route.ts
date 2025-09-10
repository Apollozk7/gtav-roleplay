import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 401 }
      )
    }

    const { userId } = await params

    // Usuários só podem ver suas próprias apostas, admins podem ver todas
    if (session.user.role !== 'ADMIN' && session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const bets = await prisma.bet.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            startTime: true
          }
        },
        participant: {
          select: {
            codename: true,
            odds: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bets)
  } catch (error) {
    console.error('Erro ao buscar apostas do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


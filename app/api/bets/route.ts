import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const bets = await prisma.bet.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            cashTapUser: true
          }
        },
        event: {
          select: {
            title: true
          }
        },
        participant: {
          select: {
            codename: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bets)
  } catch (error) {
    console.error('Erro ao buscar apostas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 401 }
      )
    }

    const { eventId, userId, participantCodename, amount, potentialWin, proofLink } = await request.json()

    if (!eventId || !userId || !participantCodename || !amount || !potentialWin) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Primeiro, criar ou encontrar o participante
    const participant = await prisma.participant.upsert({
      where: { codename: participantCodename },
      update: {},
      create: {
        codename: participantCodename,
        name: participantCodename
      }
    })

    const bet = await prisma.bet.create({
      data: {
        eventId,
        participantId: participant.id,
        userId,
        amount: parseFloat(amount),
        potentialWin: parseFloat(potentialWin),
        proofLink: proofLink || null
      }
    })

    return NextResponse.json(bet, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar aposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


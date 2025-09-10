import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            username: true
          }
        },
        participants: true,
        _count: {
          select: {
            bets: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { title, description, type, location, locationRevealTime, startTime, endTime } = await request.json()

    if (!title || !description || !type || !startTime) {
      return NextResponse.json(
        { error: 'Título, descrição, tipo e horário de início são obrigatórios' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        location: location || null,
        locationRevealTime: locationRevealTime ? new Date(locationRevealTime) : null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        creatorId: session.user.id
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendServiceRequestToDiscord } from '@/lib/discord-webhook'
import { formatBrazilDateTime } from '@/lib/timezone'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const requests = await prisma.serviceRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            cashTapUser: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            type: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Erro ao buscar solicitações de serviços:', error)
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

    const { serviceId, message } = await request.json()

    if (!serviceId) {
      return NextResponse.json(
        { error: 'ID do serviço é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o serviço existe e está ativo
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service || !service.isActive) {
      return NextResponse.json(
        { error: 'Serviço não encontrado ou inativo' },
        { status: 404 }
      )
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        serviceId,
        userId: session.user.id,
        message: message || null
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            cashTapUser: true
          }
        },
        service: {
          select: {
            name: true,
            type: true
          }
        }
      }
    })

    // Enviar webhook para Discord
    try {
      await sendServiceRequestToDiscord({
        username: serviceRequest.user.username,
        email: serviceRequest.user.email,
        cashTapUser: serviceRequest.user.cashTapUser,
        serviceName: serviceRequest.service.name,
        serviceType: serviceRequest.service.type,
        message: serviceRequest.message || undefined,
        timestamp: formatBrazilDateTime(serviceRequest.createdAt)
      })
    } catch (error) {
      console.error('Erro ao enviar webhook para Discord:', error)
      // Não falha a requisição se o webhook falhar
    }

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar solicitação de serviço:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


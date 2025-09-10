import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendServiceStatusUpdateToDiscord } from '@/lib/discord-webhook'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { id } = await params
    const { status } = await request.json()

    if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Buscar o status atual antes de atualizar
    const currentRequest = await prisma.serviceRequest.findUnique({
      where: { id },
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

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Solicitação não encontrada' },
        { status: 404 }
      )
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: { status },
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

    // Enviar webhook para Discord se o status mudou
    if (currentRequest.status !== status) {
      try {
        await sendServiceStatusUpdateToDiscord(
          serviceRequest.user.username,
          serviceRequest.service.name,
          currentRequest.status,
          status,
          session.user.username || 'Admin'
        )
      } catch (error) {
        console.error('Erro ao enviar webhook de status para Discord:', error)
        // Não falha a requisição se o webhook falhar
      }
    }

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Erro ao atualizar solicitação de serviço:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.serviceRequest.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Solicitação excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir solicitação de serviço:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


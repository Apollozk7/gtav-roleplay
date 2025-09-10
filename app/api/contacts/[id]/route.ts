import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { contactSchema, validateAndSanitize } from '@/lib/validations'
import { withRateLimit, apiRateLimit } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, apiRateLimit, async () => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        )
      }

      const { id } = await params
      const body = await request.json()
      
      // Validar e sanitizar dados
      const { type, label, value, description, isActive } = validateAndSanitize(contactSchema, body)

      const contact = await prisma.contact.update({
        where: { id },
        data: {
          type,
          label,
          value,
          description: description || null,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      return NextResponse.json(contact)
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, apiRateLimit, async () => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        )
      }

      const { id } = await params

      await prisma.contact.delete({
        where: { id }
      })

      return NextResponse.json({ message: 'Contato removido com sucesso' })
    } catch (error) {
      console.error('Erro ao remover contato:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
}

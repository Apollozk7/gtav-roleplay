import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { contactSchema, validateAndSanitize } from '@/lib/validations'
import { withRateLimit, apiRateLimit } from '@/lib/rate-limit'

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, apiRateLimit, async () => {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado' },
          { status: 403 }
        )
      }

      const body = await request.json()
      
      // Validar e sanitizar dados
      const { type, label, value, description } = validateAndSanitize(contactSchema, body)

      const contact = await prisma.contact.create({
        data: {
          type,
          label,
          value,
          description: description || null
        }
      })

      return NextResponse.json(contact, { status: 201 })
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
}

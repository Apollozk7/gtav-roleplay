import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema, validateAndSanitize } from '@/lib/validations'
import { withRateLimit, strictRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  return withRateLimit(request, strictRateLimit, async () => {
    try {
      const body = await request.json()
      
      // Validar e sanitizar dados
      const { username, email, password, cashTapUser } = validateAndSanitize(registerSchema, body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se o username já existe
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se o cashTapUser já existe
    const existingCashTap = await prisma.user.findUnique({
      where: { cashTapUser }
    })

    if (existingCashTap) {
      return NextResponse.json(
        { error: 'CashTap User já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        cashTapUser,
        role: 'USER'
      }
    })

    return NextResponse.json(
      { message: 'Usuário criado com sucesso', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  })
}


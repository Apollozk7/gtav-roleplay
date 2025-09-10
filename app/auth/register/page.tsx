"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotifications } from '@/contexts/notification-context'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    cashTapUser: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addNotification } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // Adicionar @nonpc.network ao email se não tiver
      const email = formData.email.includes('@') ? formData.email : `${formData.email}@nonpc.network`

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email,
          password: formData.password,
          cashTapUser: formData.cashTapUser
        }),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'CADASTRO REALIZADO',
          message: 'Conta criada com sucesso! Fazendo login automático...',
          duration: 3000
        })

        // Auto-login após registro
        const result = await signIn("credentials", {
          email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/')
        } else {
          router.push('/auth/signin')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao criar conta')
        addNotification({
          type: 'error',
          title: 'ERRO NO CADASTRO',
          message: data.error || 'Falha ao criar conta. Tente novamente.',
          duration: 5000
        })
      }
    } catch {
      setError('Erro ao criar conta')
      addNotification({
        type: 'error',
        title: 'ERRO NO CADASTRO',
        message: 'Erro interno. Tente novamente.',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-mono">[SOLICITAR ACESSO]</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Seu username"
                required
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex">
                <Input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Seu e-mail"
                  required
                  className="font-mono rounded-r-none"
                />
                <div className="bg-muted border border-l-0 border-input rounded-r-md px-3 py-2 text-sm text-muted-foreground font-mono">
                  @nonpc.network
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashTapUser">Usuário CashTap</Label>
              <Input
                id="cashTapUser"
                type="text"
                value={formData.cashTapUser}
                onChange={(e) => setFormData({...formData, cashTapUser: e.target.value})}
                placeholder="Seu usuário CashTap"
                required
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Sua senha"
                required
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirme sua senha"
                required
                className="font-mono"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-mono">
                [ERRO] {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-mono"
              disabled={loading}
            >
              {loading ? '[CRIANDO CONTA...]' : '[SOLICITAR ACESSO]'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem acesso?{" "}
              <Button
                variant="link"
                onClick={() => router.push('/auth/signin')}
                className="font-mono p-0 h-auto"
              >
                [FAZER LOGIN]
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



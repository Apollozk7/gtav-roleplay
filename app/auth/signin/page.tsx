"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNotifications } from '@/contexts/notification-context'

export default function SignInPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addNotification } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: emailOrUsername,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
        addNotification({
          type: 'error',
          title: 'FALHA NO LOGIN',
          message: 'Credenciais inválidas. Verifique e-mail/username e senha.',
          duration: 4000
        })
      } else {
        const session = await getSession()
        addNotification({
          type: 'success',
          title: 'ACESSO AUTORIZADO',
          message: `Bem-vindo de volta, ${session?.user?.username}!`,
          duration: 3000
        })
        
        // Redirecionar baseado no role
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch {
      setError('Erro ao fazer login')
      addNotification({
        type: 'error',
        title: 'ERRO NO LOGIN',
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
          <CardTitle className="text-2xl font-mono">[ACESSO À REDE]</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">E-mail ou Username</Label>
              <Input
                id="emailOrUsername"
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="email@nonpc.network ou seu usuário"
                required
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
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
              {loading ? '[ACESSANDO...]' : '[ACESSAR REDE]'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem acesso?{" "}
              <Button
                variant="link"
                onClick={() => router.push('/auth/register')}
                className="font-mono p-0 h-auto"
              >
                [SOLICITAR ACESSO]
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


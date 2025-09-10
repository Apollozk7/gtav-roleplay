"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNotifications } from '@/contexts/notification-context'

interface User {
  id: string
  username: string
  email: string
  cashTapUser: string
  role: string
  createdAt: string
  _count: {
    bets: number
    events: number
  }
}

export function UsersAdmin() {
  const { addNotification } = useNotifications()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        await fetchUsers()
        addNotification({
          type: 'success',
          title: 'ROLE ATUALIZADO',
          message: `Usuário ${newRole === 'ADMIN' ? 'promovido a admin' : 'rebaixado a usuário'} com sucesso!`,
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'ERRO AO ATUALIZAR',
          message: 'Falha ao atualizar role do usuário.',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO AO ATUALIZAR',
        message: 'Falha ao atualizar role do usuário.',
        duration: 5000
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600 text-white'
      case 'USER': return 'bg-blue-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'ADMIN'
      case 'USER': return 'USUÁRIO'
      default: return role
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/usuarios#</h2>
        <div className="text-center py-8">[CARREGANDO USUÁRIOS...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/usuarios#</h2>
        <div className="text-sm text-muted-foreground">
          TOTAL: {users.length} | ADMINS: {users.filter(u => u.role === 'ADMIN').length}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[GERENCIAMENTO DE USUÁRIOS]</div>
        <div className="text-accent-foreground">
          • Monitore todos os usuários da crew
          <br />• Promova usuários a administradores
          <br />• Visualize estatísticas de atividade
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">{user.username}</CardTitle>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">EMAIL:</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">CASHTAP:</div>
                  <div className="text-muted-foreground">{user.cashTapUser}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">APOSTAS:</div>
                  <div className="text-muted-foreground">{user._count.bets}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">EVENTOS:</div>
                  <div className="text-muted-foreground">{user._count.events}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
                {user.role === 'USER' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'ADMIN')}
                    className="font-mono text-xs"
                  >
                    [PROMOVER A ADMIN]
                  </Button>
                )}
                {user.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'USER')}
                    className="font-mono text-xs"
                  >
                    [REBAIXAR A USUÁRIO]
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM USUÁRIO ENCONTRADO]
        </div>
      )}
    </div>
  )
}



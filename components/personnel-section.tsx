"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  username: string
  email: string
  cashTapUser: string
  role: string
  createdAt: string
}

export function PersonnelSection() {
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
        // Filtrar apenas usuários reais (não o admin padrão)
        const realUsers = data.filter((user: User) => user.username !== 'admin')
        setUsers(realUsers)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-600 text-white"
      case "USER":
        return "bg-blue-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // const getRoleLabel = (role: string) => {
  //   switch (role) {
  //     case "ADMIN":
  //       return "ADMIN"
  //     case "USER":
  //       return "USUÁRIO"
  //     default:
  //       return role
  //   }
  // }

  const adminCount = users.filter((u) => u.role === "ADMIN").length
  const userCount = users.filter((u) => u.role === "USER").length
  const totalCount = users.length

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/integrantes#</h2>
        <div className="text-center py-8">[CARREGANDO INTEGRANTES...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/integrantes#</h2>
        <div className="text-sm text-muted-foreground">
          TOTAL: {totalCount} | ADMINS: {adminCount} | USUÁRIOS: {userCount}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[INTEGRANTES DA CREW]</div>
        <div className="text-accent-foreground">
          • Lista de membros reais da No NPC
          <br />• Apenas usuários registrados aparecem aqui
          <br />• Status sempre online para membros ativos
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">MEMBROS ATIVOS</h3>
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono flex items-center gap-2">
                    <span className="text-foreground">{user.username}</span>
                    {user.role === 'ADMIN' && (
                      <Badge className={getRoleColor(user.role)}>
                        [ADMIN]
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge className="bg-green-600 text-white">ONLINE</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-foreground">USUÁRIO:</div>
                    <div className="text-muted-foreground font-mono">{user.username}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">CASHTAP:</div>
                    <div className="text-muted-foreground font-mono">{user.cashTapUser}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">ÚLTIMA VEZ ONLINE:</div>
                  <div className="text-sm text-muted-foreground font-mono">Agora</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM INTEGRANTE ENCONTRADO]
        </div>
      )}

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[LEGENDA] ADMIN: Administrador | USUÁRIO: Membro comum</div>
          <div>[AVISO] Apenas usuários registrados aparecem nesta lista</div>
          <div>[LEMBRETE] Status sempre online para membros ativos da crew</div>
        </div>
      </div>
    </div>
  )
}

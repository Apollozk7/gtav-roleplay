"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from '@/contexts/notification-context'
import { formatBrazilDateTime } from '@/lib/timezone'

interface ServiceRequest {
  id: string
  message: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  user: {
    id: string
    username: string
    email: string
    cashTapUser: string
  }
  service: {
    id: string
    name: string
    type: 'TRANSPORT' | 'THEFT' | 'DISTRACTION' | 'OTHER'
    price: number | null
  }
}

export function ServiceRequestsAdmin() {
  const { addNotification } = useNotifications()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/service-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        setError('Erro ao carregar solicitações')
      }
    } catch {
      setError('Erro ao carregar solicitações')
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchRequests()
        addNotification({
          type: 'success',
          title: 'STATUS ATUALIZADO',
          message: `Solicitação ${status.toLowerCase()} com sucesso!`,
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'ERRO AO ATUALIZAR',
          message: 'Falha ao atualizar status da solicitação.',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO AO ATUALIZAR',
        message: 'Falha ao atualizar status da solicitação.',
        duration: 5000
      })
    }
  }

  const deleteRequest = async (requestId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return

    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRequests()
        addNotification({
          type: 'success',
          title: 'SOLICITAÇÃO EXCLUÍDA',
          message: 'Solicitação removida com sucesso!',
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'ERRO AO EXCLUIR',
          message: 'Falha ao excluir solicitação.',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO AO EXCLUIR',
        message: 'Falha ao excluir solicitação.',
        duration: 5000
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-600 text-white'
      case 'APPROVED': return 'bg-green-600 text-white'
      case 'REJECTED': return 'bg-red-600 text-white'
      case 'COMPLETED': return 'bg-blue-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'PENDENTE'
      case 'APPROVED': return 'APROVADO'
      case 'REJECTED': return 'REJEITADO'
      case 'COMPLETED': return 'CONCLUÍDO'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return 'TRANSPORTE'
      case 'THEFT': return 'ROUBO'
      case 'DISTRACTION': return 'DISTRAÇÃO'
      case 'OTHER': return 'OUTRO'
      default: return type
    }
  }

  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const totalCount = requests.length

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/solicitacoes#</h2>
        <div className="text-center py-8">[CARREGANDO SOLICITAÇÕES...]</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/solicitacoes#</h2>
        <div className="bg-red-600 text-white p-3 rounded font-mono text-sm">
          [ERRO] {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/solicitacoes#</h2>
        <div className="text-sm text-muted-foreground">
          TOTAL: {totalCount} | PENDENTES: {pendingCount}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[GERENCIAMENTO DE SOLICITAÇÕES]</div>
        <div className="text-accent-foreground">
          • Aprove ou rejeite solicitações de serviços
          <br />• Marque como concluído quando o serviço for executado
          <br />• Todas as ações são registradas no sistema
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">
                  {request.service.name} - {getTypeLabel(request.service.type)}
                </CardTitle>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">SOLICITANTE:</div>
                  <div className="text-muted-foreground">{request.user.username}</div>
                  <div className="text-xs text-muted-foreground">CashTap: {request.user.cashTapUser}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">DATA:</div>
                  <div className="text-muted-foreground">{formatBrazilDateTime(request.createdAt)}</div>
                </div>
              </div>

              {request.message && (
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">MENSAGEM:</div>
                  <div className="text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                    {request.message}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Select
                    value={request.status}
                    onValueChange={(value) => updateRequestStatus(request.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="APPROVED">Aprovado</SelectItem>
                      <SelectItem value="REJECTED">Rejeitado</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteRequest(request.id)}
                  className="font-mono text-xs text-red-600 hover:text-red-700"
                >
                  [EXCLUIR]
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUMA SOLICITAÇÃO ENCONTRADA]
        </div>
      )}

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[LEGENDA] PENDENTE: Aguardando | APROVADO: Aceito | REJEITADO: Negado | CONCLUÍDO: Finalizado</div>
          <div>[AVISO] Todas as alterações de status são registradas permanentemente</div>
        </div>
      </div>
    </div>
  )
}



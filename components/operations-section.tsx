"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatBrazilDateTime } from '@/lib/timezone'

interface Event {
  id: string
  title: string
  description: string
  type: string
  status: string
  location: string | null
  locationRevealTime: string | null
  startTime: string
  endTime: string | null
  createdAt: string
}

export function OperationsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    fetchEvents()
    
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(formatBrazilDateTime(now))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-600 text-white"
      case "PENDING":
        return "bg-yellow-600 text-white"
      case "COMPLETED":
        return "bg-blue-600 text-white"
      case "CANCELLED":
        return "bg-red-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "ATIVO"
      case "PENDING":
        return "PENDENTE"
      case "COMPLETED":
        return "CONCLUÍDO"
      case "CANCELLED":
        return "CANCELADO"
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RACE":
        return "→"
      case "MEETING":
        return "●"
      case "EVENT":
        return "○"
      default:
        return "?"
    }
  }

  const shouldRevealLocation = (event: Event) => {
    if (!event.location || !event.locationRevealTime) return false
    const now = new Date()
    const revealTime = new Date(event.locationRevealTime)
    return now >= revealTime
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/operacoes#</h2>
        <div className="text-center py-8">[CARREGANDO OPERAÇÕES...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/operacoes#</h2>
        <div className="text-sm text-muted-foreground">
          ULTIMA_ATUALIZACAO: {currentTime} | OPS_ATIVAS: {events.filter((e) => e.status === "ACTIVE").length}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 text-sm">
        <div className="text-accent font-bold">[PROTOCOLO DE SEGURANÇA ALFA-7]</div>
        <div className="text-muted-foreground">
          • Todas as operações sujeitas a contramedidas de vigilância da LSSD
          <br />• Divulgação de localização: T-2 horas antes do início da operação
          <br />• Protocolo de extração de emergência: Código VERMELHO iniciado na detecção
        </div>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-card border-border hover:border-muted transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <span className="text-muted-foreground">[{event.id.slice(0, 8)}]</span>
                  <span className="text-foreground">{event.title}</span>
                  <span className="text-xl">{getTypeIcon(event.type)}</span>
                </CardTitle>
                <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>[INÍCIO] {formatBrazilDateTime(event.startTime)}</span>
                <span>TIPO: {event.type}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">LOCALIZAÇÃO:</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {shouldRevealLocation(event) ? event.location : "[LOCALIZAÇÃO SERÁ REVELADA EM BREVE]"}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-foreground mb-1">DESCRIÇÃO:</div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </div>

              {event.locationRevealTime && (
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">REVELAR LOCAL:</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {formatBrazilDateTime(event.locationRevealTime)}
                  </div>
                </div>
              )}

              {event.status === "ACTIVE" && (
                <div className="bg-accent/10 border border-accent p-2 text-xs">
                  <div className="text-accent font-bold">[OPERAÇÃO AO VIVO]</div>
                  <div className="text-muted-foreground">
                    Atualizações de status serão transmitidas via canais criptografados
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUMA OPERAÇÃO ENCONTRADA]
        </div>
      )}

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[LEGENDA] → CORRIDA | ● ENCONTRO | ○ EVENTO</div>
          <div>[AVISO] Divulgação não autorizada de detalhes da operação é punível sob o Protocolo 7</div>
          <div>[AVISO] Todos os timestamps em horário de Brasília (GMT-3)</div>
        </div>
      </div>
    </div>
  )
}

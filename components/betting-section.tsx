"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from '@/contexts/notification-context'
import { formatBrazilDateTime } from '@/lib/timezone'

interface Event {
  id: string
  title: string
  description: string
  type: string
  status: string
  startTime: string
  participants: Array<{
    id: string
    codename: string
    odds: number
  }>
}

interface Bet {
  id: string
  amount: number
  potentialWin: number
  status: string
  proofLink: string
  createdAt: string
  event: {
    title: string
  }
  participant: {
    codename: string
    odds: number
  }
}

export function BettingSection() {
  const { data: session } = useSession()
  const { addNotification } = useNotifications()
  const [events, setEvents] = useState<Event[]>([])
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [betAmount, setBetAmount] = useState("")
  const [proofLink, setProofLink] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
    if (session?.user?.id) {
      fetchUserBets()
    }
  }, [session, fetchUserBets])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBets = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/bets/user/${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserBets(data)
      }
    } catch {
      console.error('Erro ao carregar apostas do usuário')
    }
  }, [session?.user?.id])

  const calculatePotentialWin = (amount: number, odds: number) => {
    return amount * odds
  }

  const handlePlaceBet = async () => {
    if (!selectedEvent || !selectedParticipant || !betAmount || !proofLink) {
      addNotification({
        type: 'error',
        title: 'ERRO NA APOSTA',
        message: 'Todos os campos são obrigatórios, incluindo o comprovante.',
        duration: 4000
      })
      return
    }

    const amount = parseInt(betAmount)
    if (amount < 1000) {
      addNotification({
        type: 'error',
        title: 'ERRO NA APOSTA',
        message: 'Valor mínimo da aposta é $1.000.',
        duration: 4000
      })
      return
    }

    const event = events.find((e) => e.id === selectedEvent)
    const participant = event?.participants.find((p) => p.id === selectedParticipant)

    if (!event || !participant) {
      addNotification({
        type: 'error',
        title: 'ERRO NA APOSTA',
        message: 'Evento ou participante inválido.',
        duration: 4000
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/bets/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          participantId: selectedParticipant,
          amount: amount,
          potentialWin: calculatePotentialWin(amount, participant.odds),
          proofLink: proofLink
        }),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'APOSTA REALIZADA',
          message: 'Aposta criada com sucesso! Aguarde confirmação.',
          duration: 4000
        })
        
        // Reset form
        setSelectedEvent("")
        setSelectedParticipant("")
        setBetAmount("")
        setProofLink("")
        
        // Refresh user bets
        await fetchUserBets()
      } else {
        const data = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO NA APOSTA',
          message: data.error || 'Falha ao criar aposta.',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO NA APOSTA',
        message: 'Erro interno. Tente novamente.',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
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

  const getBetStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600 text-white"
      case "CONFIRMED":
        return "bg-blue-600 text-white"
      case "PAID":
        return "bg-green-600 text-white"
      case "CANCELLED":
        return "bg-red-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getBetStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "PENDENTE"
      case "CONFIRMED":
        return "CONFIRMADO"
      case "PAID":
        return "PAGO"
      case "CANCELLED":
        return "CANCELADO"
      default:
        return status
    }
  }

  const selectedEventData = events.find((e) => e.id === selectedEvent)

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/apostas#</h2>
        <div className="text-center py-8">[CARREGANDO APOSTAS...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/apostas#</h2>
        <div className="text-sm text-muted-foreground">
          APOSTAS_ATIVAS: {userBets.filter((bet) => bet.status === "PENDING").length} | EVENTOS: {events.length}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[PROTOCOLO DE APOSTAS BETA-3]</div>
        <div className="text-accent-foreground">
          • Valor mínimo: $1.000 | Comprovante de pagamento obrigatório
          <br />• Apostas bloqueadas 30 minutos antes do início do evento
          <br />• Pagamentos processados em até 24 horas após conclusão
        </div>
      </div>

      {/* Active Events */}
      <div className="grid gap-4">
        <h3 className="text-lg font-bold text-foreground">EVENTOS ATIVOS</h3>
        {events.map((event) => (
          <Card key={event.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <span className="text-muted-foreground">[{event.id.slice(0, 8)}]</span>
                  <span className="text-foreground">{event.title}</span>
                </CardTitle>
                <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>INÍCIO: {formatBrazilDateTime(event.startTime)}</span>
                <span>TIPO: {event.type}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">DESCRIÇÃO:</div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Betting Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-foreground">[FAZER APOSTA]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event" className="text-sm font-semibold">
                EVENTO
              </Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {events
                    .filter((e) => e.status === "ACTIVE")
                    .map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participant" className="text-sm font-semibold">
                PARTICIPANTE
              </Label>
              <Select value={selectedParticipant} onValueChange={setSelectedParticipant} disabled={!selectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um participante" />
                </SelectTrigger>
                <SelectContent>
                  {selectedEventData?.participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.codename} (Odds: {participant.odds}x)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                VALOR DA APOSTA ($)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Mínimo $1.000"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min={1000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof" className="text-sm font-semibold">
                COMPROVANTE
              </Label>
              <Input
                id="proof"
                placeholder="((Faça upload da imagem e coloque o link aqui))"
                value={proofLink}
                onChange={(e) => setProofLink(e.target.value)}
                required
              />
            </div>
          </div>

          {selectedParticipant && betAmount && selectedEventData && (
            <div className="bg-primary/10 border border-primary p-3 rounded text-sm">
              <div className="text-primary font-bold">CÁLCULO DE GANHO POTENCIAL:</div>
              <div className="text-primary">
                Aposta: ${parseInt(betAmount || "0").toLocaleString()} → Ganho Potencial: $
                {calculatePotentialWin(
                  parseInt(betAmount || "0"),
                  selectedEventData.participants.find((p) => p.id === selectedParticipant)?.odds || 1,
                ).toLocaleString()}
              </div>
            </div>
          )}

          <Button 
            onClick={handlePlaceBet} 
            className="w-full font-mono"
            disabled={submitting}
          >
            {submitting ? '[ENVIANDO...]' : '[FAZER APOSTA]'}
          </Button>
        </CardContent>
      </Card>

      {/* User Bets */}
      {userBets.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-foreground">SUAS APOSTAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userBets.map((bet) => (
                <div key={bet.id} className="bg-muted/20 p-3 rounded text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-foreground">
                      {bet.event.title} - {bet.participant.codename}
                    </div>
                    <Badge className={getBetStatusColor(bet.status)}>
                      {getBetStatusLabel(bet.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>Valor: ${bet.amount.toLocaleString()}</div>
                    <div>Ganho: ${bet.potentialWin.toLocaleString()}</div>
                    <div>Participante: {bet.participant.codename}</div>
                    <div>Data: {formatBrazilDateTime(bet.createdAt)}</div>
                  </div>
                  {bet.proofLink && (
                    <div className="mt-2">
                      <a
                        href={bet.proofLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                      >
                        [VER COMPROVANTE]
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM EVENTO ENCONTRADO]
        </div>
      )}

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[AVISO] Todas as apostas são finais após confirmação pelos administradores</div>
          <div>[AVISO] Comprovantes fraudulentos resultam em consequências graves. Não tente ser esperto.</div>
        </div>
      </div>
    </div>
  )
}

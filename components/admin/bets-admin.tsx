"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNotifications } from '@/contexts/notification-context'

interface Bet {
  id: string
  amount: number
  potentialWin: number
  status: string
  proofLink: string
  createdAt: string
  user: {
    username: string
    email: string
    cashTapUser: string
  }
  event: {
    title: string
  }
  participant: {
    codename: string
  }
}

interface Event {
  id: string
  title: string
  status: string
}

interface User {
  id: string
  username: string
  email: string
  cashTapUser: string
}

export function BetsAdmin() {
  const { addNotification } = useNotifications()
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    eventId: '',
    userId: '',
    participantCodename: '',
    amount: '',
    potentialWin: '',
    proofLink: ''
  })

  useEffect(() => {
    fetchBets()
    fetchEvents()
    fetchUsers()
  }, [])

  const fetchBets = async () => {
    try {
      const response = await fetch('/api/bets')
      if (response.ok) {
        const data = await response.json()
        setBets(data)
      }
    } catch (error) {
      console.error('Erro ao carregar apostas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.filter((event: Event) => event.status === 'ACTIVE'))
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.filter((user: User) => user.email !== 'admin@nonpc.network'))
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const betData = {
        ...formData,
        amount: parseFloat(formData.amount),
        potentialWin: parseFloat(formData.potentialWin),
        proofLink: formData.proofLink || null
      }

      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betData),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'APOSTA CRIADA',
          message: 'Aposta criada com sucesso!',
          duration: 3000
        })
        setIsDialogOpen(false)
        setFormData({
          eventId: '',
          userId: '',
          participantCodename: '',
          amount: '',
          potentialWin: '',
          proofLink: ''
        })
        fetchBets()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: error.message || 'Erro ao criar aposta',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro ao criar aposta',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-600 text-white'
      case 'CONFIRMED': return 'bg-blue-600 text-white'
      case 'PAID': return 'bg-green-600 text-white'
      case 'CANCELLED': return 'bg-red-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'PENDENTE'
      case 'CONFIRMED': return 'CONFIRMADO'
      case 'PAID': return 'PAGO'
      case 'CANCELLED': return 'CANCELADO'
      default: return status
    }
  }

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
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            TOTAL: {bets.length} | PENDENTES: {bets.filter(b => b.status === 'PENDING').length}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono bg-gray-600 hover:bg-gray-700 text-white">
                [CRIAR APOSTA]
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground font-mono">[CRIAR NOVA APOSTA]</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">EVENTO:</label>
                    <Select value={formData.eventId} onValueChange={(value) => setFormData({...formData, eventId: value})}>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione um evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">USUÁRIO:</label>
                    <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.username} ({user.cashTapUser})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">CÓDIGO DO PARTICIPANTE:</label>
                  <Input
                    value={formData.participantCodename}
                    onChange={(e) => setFormData({...formData, participantCodename: e.target.value})}
                    placeholder="Ex: SPEED_DEMON"
                    required
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">VALOR DA APOSTA:</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      required
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">GANHO POTENCIAL:</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.potentialWin}
                      onChange={(e) => setFormData({...formData, potentialWin: e.target.value})}
                      placeholder="0.00"
                      required
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">COMPROVANTE (opcional):</label>
                  <Input
                    value={formData.proofLink}
                    onChange={(e) => setFormData({...formData, proofLink: e.target.value})}
                    placeholder="URL do comprovante (se disponível)"
                    className="font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="font-mono"
                  >
                    [CANCELAR]
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="font-mono bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    {submitting ? '[CRIANDO...]' : '[CRIAR APOSTA]'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[GERENCIAMENTO DE APOSTAS]</div>
        <div className="text-accent-foreground">
          • Monitore todas as apostas da crew
          <br />• Confirme pagamentos e status
          <br />• Gerencie comprovantes de pagamento
        </div>
      </div>

      <div className="grid gap-4">
        {bets.map((bet) => (
          <Card key={bet.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">
                  {bet.event.title} - {bet.participant.codename}
                </CardTitle>
                <Badge className={getStatusColor(bet.status)}>
                  {getStatusLabel(bet.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">APOSTADOR:</div>
                  <div className="text-muted-foreground">{bet.user.username}</div>
                  <div className="text-xs text-muted-foreground">CashTap: {bet.user.cashTapUser}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">VALORES:</div>
                  <div className="text-muted-foreground">Aposta: ${bet.amount}</div>
                  <div className="text-muted-foreground">Ganho: ${bet.potentialWin}</div>
                </div>
              </div>

              {bet.proofLink && (
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">COMPROVANTE:</div>
                  <div className="text-sm text-muted-foreground">
                    <a href={bet.proofLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Ver comprovante
                    </a>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Data: {new Date(bet.createdAt).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUMA APOSTA ENCONTRADA]
        </div>
      )}
    </div>
  )
}



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNotifications } from '@/contexts/notification-context'
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

export function EventsAdmin() {
  const { addNotification } = useNotifications()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RACE' as 'RACE' | 'MEETING' | 'ARRANCADA' | 'TOUGE' | 'CAR_MEET' | 'TAKEOVER' | 'OTHER',
    location: '',
    locationRevealTime: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const eventData = {
        ...formData,
        location: formData.location || null,
        locationRevealTime: formData.locationRevealTime || null,
        endTime: formData.endTime || null
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'EVENTO CRIADO',
          message: 'Evento criado com sucesso!',
          duration: 3000
        })
        setIsDialogOpen(false)
        setFormData({
          title: '',
          description: '',
          type: 'RACE',
          location: '',
          locationRevealTime: '',
          startTime: '',
          endTime: ''
        })
        fetchEvents()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: error.message || 'Erro ao criar evento',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro ao criar evento',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/eventos#</h2>
        <div className="text-center py-8">[CARREGANDO EVENTOS...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/eventos#</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            TOTAL: {events.length} | ATIVOS: {events.filter(e => e.status === 'ACTIVE').length}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono bg-gray-600 hover:bg-gray-700 text-white">
                [CRIAR EVENTO]
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground font-mono">[CRIAR NOVO EVENTO]</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">TÍTULO:</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Nome do evento"
                      required
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">TIPO:</label>
                    <Select value={formData.type} onValueChange={(value: 'RACE' | 'MEETING' | 'ARRANCADA' | 'TOUGE' | 'CAR_MEET' | 'TAKEOVER' | 'OTHER') => setFormData({...formData, type: value})}>
                      <SelectTrigger className="font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RACE">CORRIDA</SelectItem>
                        <SelectItem value="ARRANCADA">ARRANCADA</SelectItem>
                        <SelectItem value="TOUGE">TOUGE</SelectItem>
                        <SelectItem value="CAR_MEET">CAR MEET</SelectItem>
                        <SelectItem value="TAKEOVER">TAKEOVER</SelectItem>
                        <SelectItem value="MEETING">REUNIÃO</SelectItem>
                        <SelectItem value="OTHER">OUTRO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-foreground">DESCRIÇÃO:</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do evento"
                    required
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">INÍCIO:</label>
                    <Input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      required
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">FIM (opcional):</label>
                    <Input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">LOCAL:</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Local do evento"
                    className="font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">REVELAR LOCAL EM:</label>
                  <Input
                    type="datetime-local"
                    value={formData.locationRevealTime}
                    onChange={(e) => setFormData({...formData, locationRevealTime: e.target.value})}
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
                    {submitting ? '[CRIANDO...]' : '[CRIAR EVENTO]'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[GERENCIAMENTO DE EVENTOS]</div>
        <div className="text-accent-foreground">
          • Crie e gerencie eventos da crew
          <br />• Configure horários de revelação de localização
          <br />• Monitore status e participações
        </div>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">{event.title}</CardTitle>
                <Badge className="bg-primary text-primary-foreground">
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">DESCRIÇÃO:</div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">STATUS:</div>
                  <div className="text-muted-foreground">{event.status}</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">INÍCIO:</div>
                  <div className="text-muted-foreground">{formatBrazilDateTime(event.startTime)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM EVENTO ENCONTRADO]
        </div>
      )}
    </div>
  )
}



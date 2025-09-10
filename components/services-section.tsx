"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNotifications } from '@/contexts/notification-context'

interface Service {
  id: string
  name: string
  description: string
  type: "TRANSPORT" | "THEFT" | "DISTRACTION" | "OTHER"
  price: number | null
  isActive: boolean
  createdAt: string
}

export function ServicesSection() {
  const { addNotification } = useNotifications()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.filter((service: Service) => service.isActive))
      }
    } catch {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestService = async () => {
    if (!selectedService) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          message: requestMessage.trim() || null
        }),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'SOLICITAÇÃO ENVIADA',
          message: `Solicitação para ${selectedService.name} enviada com sucesso!`,
          duration: 4000
        })
        setIsDialogOpen(false)
        setRequestMessage('')
        setSelectedService(null)
      } else {
        const data = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO NA SOLICITAÇÃO',
          message: data.error || 'Falha ao enviar solicitação. Tente novamente.',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO NA SOLICITAÇÃO',
        message: 'Falha ao enviar solicitação. Tente novamente.',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openRequestDialog = (service: Service) => {
    setSelectedService(service)
    setRequestMessage('')
    setIsDialogOpen(true)
  }

  const getTypeColor = (type: Service["type"]) => {
    switch (type) {
      case "TRANSPORT": return "bg-blue-600 text-white"
      case "THEFT": return "bg-red-600 text-white"
      case "DISTRACTION": return "bg-yellow-600 text-white"
      case "OTHER": return "bg-gray-600 text-white"
      default: return "bg-gray-600 text-white"
    }
  }

  const getTypeLabel = (type: Service["type"]) => {
    switch (type) {
      case "TRANSPORT": return "TRANSPORTE"
      case "THEFT": return "ROUBO"
      case "DISTRACTION": return "DISTRAÇÃO"
      case "OTHER": return "OUTRO"
      default: return type
    }
  }

  const getTypeIcon = (type: Service["type"]) => {
    switch (type) {
      case "TRANSPORT": return "🚗"
      case "THEFT": return "💰"
      case "DISTRACTION": return "🎭"
      case "OTHER": return "⚙️"
      default: return "❓"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/servicos#</h2>
        <div className="text-center py-8">[CARREGANDO SERVIÇOS...]</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">root@no-npc:~/servicos#</h2>
        <div className="text-sm text-muted-foreground">
          SERVICOS_ATIVOS: {services.length} | DISPONÍVEIS_24H
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 text-sm">
        <div className="text-accent font-bold">[PROTOCOLO DE SERVIÇOS GAMMA-5]</div>
        <div className="text-muted-foreground">
          • Todos os serviços sujeitos a disponibilidade de pessoal
          <br />• Pagamento antecipado obrigatório via canais seguros
          <br />• Protocolo de sigilo absoluto - informações não compartilhadas com terceiros
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="bg-card border-border hover:border-muted transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(service.type)}</span>
                  <span className="text-foreground">{service.name}</span>
                </CardTitle>
                <Badge className={getTypeColor(service.type)}>
                  {getTypeLabel(service.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">DESCRIÇÃO:</div>
                <div className="text-sm text-muted-foreground">{service.description}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">PREÇO:</div>
                  <div className="text-sm text-muted-foreground">
                    {service.price ? `$${service.price.toLocaleString()}` : 'Sob consulta'}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-mono text-xs"
                  onClick={() => openRequestDialog(service)}
                >
                  [SOLICITAR]
                </Button>
              </div>

              <div className="bg-muted/20 p-2 text-xs">
                <div className="text-muted-foreground">
                  <span className="font-semibold">[AVISO]</span> Serviço disponível 24/7. 
                  Contate administradores para coordenação.
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM SERVIÇO DISPONÍVEL] - Aguarde atualizações
        </div>
      )}

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[LEGENDA] 🚗 TRANSPORTE | 💰 ROUBO | 🎭 DISTRAÇÃO | ⚙️ OUTRO</div>
          <div>[AVISO] Todos os serviços são confidenciais e sujeitos a protocolos de segurança</div>
          <div>[LEMBRETE] Use apenas canais criptografados para solicitações</div>
        </div>
      </div>

      {/* Dialog de Solicitação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono">
              [SOLICITAR SERVIÇO]
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4">
              <div className="bg-muted/20 p-3 rounded">
                <div className="text-sm font-semibold text-foreground mb-1">
                  SERVIÇO SELECIONADO:
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedService.name} - {getTypeLabel(selectedService.type)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedService.description}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Textarea
                  id="message"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Descreva detalhes específicos da sua solicitação..."
                  className="font-mono text-sm"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRequestService}
                  disabled={submitting}
                  className="font-mono"
                >
                  {submitting ? '[ENVIANDO...]' : '[ENVIAR SOLICITAÇÃO]'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


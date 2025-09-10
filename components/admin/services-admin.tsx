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

interface Service {
  id: string
  name: string
  description: string
  type: string
  price: number | null
  isActive: boolean
  createdAt: string
}

export function ServicesAdmin() {
  const { addNotification } = useNotifications()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'TRANSPORT' as 'TRANSPORT' | 'THEFT' | 'DISTRACTION' | 'OTHER',
    price: '',
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const serviceData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'SERVIÇO CRIADO',
          message: 'Serviço criado com sucesso!',
          duration: 3000
        })
        setIsDialogOpen(false)
        setFormData({
          name: '',
          description: '',
          type: 'TRANSPORT',
          price: '',
          isActive: true
        })
        fetchServices()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: error.message || 'Erro ao criar serviço',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro ao criar serviço',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'SERVIÇO EXCLUÍDO',
          message: 'Serviço excluído com sucesso!',
          duration: 3000
        })
        fetchServices()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: error.message || 'Erro ao excluir serviço',
          duration: 5000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro ao excluir serviço',
        duration: 5000
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return 'bg-blue-600 text-white'
      case 'THEFT': return 'bg-red-600 text-white'
      case 'DISTRACTION': return 'bg-yellow-600 text-white'
      case 'OTHER': return 'bg-gray-600 text-white'
      default: return 'bg-gray-600 text-white'
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
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            TOTAL: {services.length} | ATIVOS: {services.filter(s => s.isActive).length}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono bg-gray-600 hover:bg-gray-700 text-white">
                [CRIAR SERVIÇO]
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground font-mono">[CRIAR NOVO SERVIÇO]</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">NOME:</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nome do serviço"
                      required
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">TIPO:</label>
                    <Select value={formData.type} onValueChange={(value: 'TRANSPORT' | 'THEFT' | 'DISTRACTION' | 'OTHER') => setFormData({...formData, type: value})}>
                      <SelectTrigger className="font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRANSPORT">TRANSPORTE</SelectItem>
                        <SelectItem value="THEFT">ROUBO</SelectItem>
                        <SelectItem value="DISTRACTION">DISTRAÇÃO</SelectItem>
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
                    placeholder="Descrição do serviço"
                    required
                    className="font-mono"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">PREÇO (opcional):</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="Preço em dólares"
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
                    {submitting ? '[CRIANDO...]' : '[CRIAR SERVIÇO]'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[GERENCIAMENTO DE SERVIÇOS]</div>
        <div className="text-accent-foreground">
          • Crie e gerencie serviços da crew
          <br />• Configure preços e disponibilidade
          <br />• Monitore solicitações de usuários
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">{service.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(service.type)}>
                    {getTypeLabel(service.type)}
                  </Badge>
                  <Badge className={service.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                    {service.isActive ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">DESCRIÇÃO:</div>
                <div className="text-sm text-muted-foreground">{service.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-foreground">PREÇO:</div>
                  <div className="text-muted-foreground">
                    {service.price ? `$${service.price.toLocaleString()}` : 'Sob consulta'}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">CRIADO EM:</div>
                  <div className="text-muted-foreground">{new Date(service.createdAt).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteService(service.id)}
                  className="font-mono text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  [EXCLUIR]
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          [NENHUM SERVIÇO ENCONTRADO]
        </div>
      )}
    </div>
  )
}



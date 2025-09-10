"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useNotifications } from '@/contexts/notification-context'

interface Contact {
  id: string
  type: 'PHONE' | 'EMAIL' | 'TELEGRAM' | 'DISCORD' | 'WHATSAPP' | 'OTHER'
  label: string
  value: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function ContactsAdmin() {
  const { data: session } = useSession()
  const { addNotification } = useNotifications()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'PHONE' as Contact['type'],
    label: '',
    value: '',
    description: '',
    isActive: true
  })

  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch {
      console.error('Erro ao buscar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts'
      const method = editingContact ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'SUCESSO',
          message: editingContact ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!',
          duration: 3000
        })
        
        setIsDialogOpen(false)
        setEditingContact(null)
        setFormData({
          type: 'PHONE',
          label: '',
          value: '',
          description: '',
          isActive: true
        })
        fetchContacts()
      } else {
        const error = await response.json()
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: error.error || 'Erro ao salvar contato',
          duration: 4000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro interno. Tente novamente.',
        duration: 5000
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      description: contact.description || '',
      isActive: contact.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Tem certeza que deseja remover este contato?')) return

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'SUCESSO',
          message: 'Contato removido com sucesso!',
          duration: 3000
        })
        fetchContacts()
      } else {
        addNotification({
          type: 'error',
          title: 'ERRO',
          message: 'Erro ao remover contato',
          duration: 4000
        })
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'ERRO',
        message: 'Erro interno. Tente novamente.',
        duration: 5000
      })
    }
  }

  const getTypeLabel = (type: Contact['type']) => {
    const labels = {
      PHONE: 'Telefone',
      EMAIL: 'E-mail',
      TELEGRAM: 'Telegram',
      DISCORD: 'Discord',
      WHATSAPP: 'WhatsApp',
      OTHER: 'Outro'
    }
    return labels[type]
  }

  const getTypeIcon = (type: Contact['type']) => {
    const icons = {
      PHONE: '📞',
      EMAIL: '📧',
      TELEGRAM: '✈️',
      DISCORD: '🎮',
      WHATSAPP: '💬',
      OTHER: '📋'
    }
    return icons[type]
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Acesso negado. Apenas administradores podem gerenciar contatos.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando contatos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">GERENCIAR CONTATOS</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingContact(null)
                setFormData({
                  type: 'PHONE',
                  label: '',
                  value: '',
                  description: '',
                  isActive: true
                })
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              [ADICIONAR CONTATO]
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {editingContact ? '[EDITAR CONTATO]' : '[NOVO CONTATO]'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Contact['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE">📞 Telefone</SelectItem>
                    <SelectItem value="EMAIL">📧 E-mail</SelectItem>
                    <SelectItem value="TELEGRAM">✈️ Telegram</SelectItem>
                    <SelectItem value="DISCORD">🎮 Discord</SelectItem>
                    <SelectItem value="WHATSAPP">💬 WhatsApp</SelectItem>
                    <SelectItem value="OTHER">📋 Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Burner Phone, Telegram Oficial"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Ex: +55 (11) 99999-9999"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Informações adicionais sobre este contato"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Ativo</Label>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {submitting ? '[SALVANDO...]' : '[SALVAR]'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  [CANCELAR]
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  {getTypeIcon(contact.type)} {contact.label}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={contact.isActive ? "bg-green-600" : "bg-red-600"}>
                    {contact.isActive ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeLabel(contact.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">VALOR:</div>
                <div className="text-lg text-muted-foreground font-mono">{contact.value}</div>
              </div>

              {contact.description && (
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">DESCRIÇÃO:</div>
                  <div className="text-sm text-muted-foreground">{contact.description}</div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={() => handleEdit(contact)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  [EDITAR]
                </Button>
                <Button
                  onClick={() => handleDelete(contact.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  [REMOVER]
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum contato cadastrado.</p>
            <p className="text-sm text-muted-foreground mt-2">Clique em [ADICIONAR CONTATO] para começar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

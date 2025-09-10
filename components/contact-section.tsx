"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Contact {
  id: string
  type: 'PHONE' | 'EMAIL' | 'TELEGRAM' | 'DISCORD' | 'WHATSAPP' | 'OTHER'
  label: string
  value: string
  description?: string
  isActive: boolean
}

export function ContactSection() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
    } finally {
      setLoading(false)
    }
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

  const getTypeLabel = (type: Contact['type']) => {
    const labels = {
      PHONE: 'TELEFONE',
      EMAIL: 'E-MAIL',
      TELEGRAM: 'TELEGRAM',
      DISCORD: 'DISCORD',
      WHATSAPP: 'WHATSAPP',
      OTHER: 'OUTRO'
    }
    return labels[type]
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">root@no-npc:~/contato#</h2>
        <div className="text-sm text-muted-foreground">CANAL: 1 | STATUS: ATIVO</div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[INFORMAÇÕES DE CONTATO]</div>
        <div className="text-accent-foreground">
          • Use apenas para assuntos relacionados à No NPC
          <br />• Mantenha conversas breves e objetivas
          <br />• Não compartilhe informações sensíveis por telefone
        </div>
      </div>

      {/* Contatos Dinâmicos */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">INFORMAÇÕES DE CONTATO</h3>
        
        {loading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Carregando contatos...</p>
          </div>
        ) : contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono flex items-center gap-2">
                      {getTypeIcon(contact.type)} {contact.label}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={contact.isActive ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
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

                  {contact.type === 'PHONE' && (
                    <div className="bg-yellow-600/20 border border-yellow-600/50 p-3 rounded text-sm">
                      <div className="text-yellow-600 font-bold mb-2">⚠️ AVISO IMPORTANTE</div>
                      <div className="text-yellow-600/90">
                        O número pode estar queimado, não se surpreenda se não for atendido em três ou quatro ligações em horários diferentes.
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/20 p-2 text-xs">
                    <div className="text-muted-foreground">
                      <span className="font-semibold">[PROTOCOLO]</span> Use apenas para assuntos urgentes da crew. 
                      Mantenha conversas breves e evite mencionar detalhes específicos.
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum contato disponível no momento.</p>
            <p className="text-sm text-muted-foreground mt-2">Entre em contato com um administrador.</p>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[LEGENDA] ATIVO: Disponível para contato | BURNER: Número descartável</div>
          <div>[AVISO] Número pode estar queimado - tente em horários diferentes</div>
          <div>[LEMBRETE] Use apenas para assuntos relacionados à No NPC</div>
        </div>
      </div>
    </div>
  )
}

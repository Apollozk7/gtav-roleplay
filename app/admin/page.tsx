"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { MatrixBackground } from "@/components/matrix-background"
import { TerminalHeader } from "@/components/terminal-header"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventsAdmin } from "@/components/admin/events-admin"
import { BetsAdmin } from "@/components/admin/bets-admin"
import { ServicesAdmin } from "@/components/admin/services-admin"
import { ServiceRequestsAdmin } from "@/components/admin/service-requests-admin"
import { UsersAdmin } from "@/components/admin/users-admin"
import { ContactsAdmin } from "@/components/admin/contacts-admin"
import { useNotifications } from '@/contexts/notification-context'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("events")

  const handleLogout = async () => {
    addNotification({
      type: 'info',
      title: 'LOGOUT REALIZADO',
      message: 'Sessão encerrada com sucesso. Até logo!',
      duration: 3000
    })
    await signOut()
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground font-mono">[CARREGANDO PAINEL ADMIN...]</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-mono text-foreground">[ACESSO NEGADO]</h1>
          <p className="text-muted-foreground">Você precisa estar logado para acessar o painel administrativo</p>
          <Button onClick={() => window.location.href = '/auth/signin'} className="font-mono">
            [FAZER LOGIN]
          </Button>
        </div>
      </div>
    )
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-mono text-foreground">[ACESSO NEGADO]</h1>
          <p className="text-muted-foreground">Apenas administradores podem acessar este painel</p>
          <Button onClick={() => window.location.href = '/'} className="font-mono">
            [VOLTAR AO INÍCIO]
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground terminal-flicker">
      <MatrixBackground />

      <div className="scan-lines relative z-10">
        <TerminalHeader />

        <div className="p-8 text-center border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl md:text-6xl font-bold glitch text-foreground" data-text="NO NPC NETWORK">
              NO NPC NETWORK
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-mono">
                [{session.user.username}] | CashTap: {session.user.cashTapUser}
              </span>
              <span className="text-xs px-2 py-1 rounded font-mono bg-red-600 text-white border border-red-600">
                [ADMIN MODE]
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
                className="font-mono text-xs"
              >
                [PAINEL USUÁRIO]
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="font-mono text-xs"
              >
                [LOGOUT]
              </Button>
            </div>
          </div>
          <p className="text-xl mb-6 terminal-cursor text-muted-foreground">
            Controle total da rede No NPC
          </p>
          <div className="text-accent text-sm">[ADMINISTRADOR] - ACESSO COMPLETO - [ADMINISTRADOR]</div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="bg-red-600/10 border border-red-600/50 p-4 rounded">
                <h2 className="text-lg font-bold text-red-600 font-mono mb-2">[PAINEL ADMINISTRATIVO]</h2>
                <p className="text-red-600/90 text-sm">
                  Você está no painel administrativo. Use as abas abaixo para gerenciar eventos, apostas, serviços e usuários.
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="events" className="font-mono">[EVENTOS]</TabsTrigger>
                  <TabsTrigger value="bets" className="font-mono">[APOSTAS]</TabsTrigger>
                  <TabsTrigger value="services" className="font-mono">[SERVIÇOS]</TabsTrigger>
                  <TabsTrigger value="requests" className="font-mono">[SOLICITAÇÕES]</TabsTrigger>
                  <TabsTrigger value="contacts" className="font-mono">[CONTATOS]</TabsTrigger>
                  <TabsTrigger value="users" className="font-mono">[USUÁRIOS]</TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                  <EventsAdmin />
                </TabsContent>

                <TabsContent value="bets">
                  <BetsAdmin />
                </TabsContent>

                <TabsContent value="services">
                  <ServicesAdmin />
                </TabsContent>

                <TabsContent value="requests">
                  <ServiceRequestsAdmin />
                </TabsContent>

                <TabsContent value="contacts">
                  <ContactsAdmin />
                </TabsContent>

                <TabsContent value="users">
                  <UsersAdmin />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          <div>NO NPC NETWORK © 2025 | Painel Administrativo | Todas as transmissões criptografadas</div>
        </footer>
      </div>
    </div>
  )
}



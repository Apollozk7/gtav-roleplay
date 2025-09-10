"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { MatrixBackground } from "@/components/matrix-background"
import { TerminalHeader } from "@/components/terminal-header"
import { Navigation } from "@/components/navigation"
import { OperationsSection } from "@/components/operations-section"
import { BettingSection } from "@/components/betting-section"
import { ServicesSection } from "@/components/services-section"
import { PersonnelSection } from "@/components/personnel-section"
import { SecuritySection } from "@/components/security-section"
import { ContactSection } from "@/components/contact-section"
import { Button } from "@/components/ui/button"
import { useNotifications } from '@/contexts/notification-context'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("operations")
  const { data: session, status } = useSession()
  const { addNotification } = useNotifications()

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
        <div className="text-foreground font-mono">[CARREGANDO SISTEMA...]</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-mono text-foreground">[ACESSO NEGADO]</h1>
          <p className="text-muted-foreground">Você precisa estar logado para acessar a rede</p>
          <Button onClick={() => window.location.href = '/auth/signin'} className="font-mono">
            [FAZER LOGIN]
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
              {session.user.role === 'ADMIN' && (
                <span className="text-xs px-2 py-1 rounded font-mono bg-muted/50 text-muted-foreground border border-muted">
                  [USER MODE]
                </span>
              )}
              {session.user.role === 'ADMIN' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/admin'}
                  className="font-mono text-xs"
                >
                  [PAINEL ADMIN]
                </Button>
              )}
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
            Nós temos personalidade, diferente de vocês.
          </p>
          <div className="text-accent text-sm">[CLASSIFIED] ILLEGAL RACING CREW [CLASSIFIED]</div>
        </div>

        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              {session.user.role === 'ADMIN' && (
                <div className="bg-muted/50 border border-muted p-4 rounded">
                  <h2 className="text-lg font-bold text-muted-foreground font-mono mb-2">[PAINEL DO USUÁRIO]</h2>
                  <p className="text-muted-foreground text-sm">
                    Você está no painel normal. Use o botão [PAINEL ADMIN] para acessar funcionalidades administrativas.
                  </p>
                </div>
              )}
              {activeSection === "operations" && <OperationsSection />}
              {activeSection === "betting" && <BettingSection />}
              {activeSection === "services" && <ServicesSection />}
              {activeSection === "personnel" && <PersonnelSection />}
              {activeSection === "security" && <SecuritySection />}
              {activeSection === "contact" && <ContactSection />}
            </div>
          </div>
        </div>

        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          <div>NO NPC NETWORK © 2025 | Todas as transmissões criptografadas | Proteção contra rastreamento ativa</div>
        </footer>
      </div>
    </div>
  )
}

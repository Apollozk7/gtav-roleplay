"use client"
import { Button } from "@/components/ui/button"

const navItems = [
  { id: "operations", label: "OPERAÇÕES", description: "Missões ativas e corridas" },
  { id: "betting", label: "APOSTAS", description: "Sistema de apostas" },
  { id: "services", label: "SERVIÇOS", description: "Transporte, roubos e distrações" },
  { id: "personnel", label: "INTEGRANTES", description: "Membros da crew" },
  { id: "security", label: "SEGURANÇA", description: "Protocolos e manifesto" },
  { id: "contact", label: "CONTATO", description: "Canais criptografados" },
]

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "outline"}
            onClick={() => onSectionChange(item.id)}
            className="font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            [{item.label}]
          </Button>
        ))}
      </div>
    </nav>
  )
}

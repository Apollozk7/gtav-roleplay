"use client"

import { SessionProvider } from 'next-auth/react'
import { NotificationProvider } from '@/contexts/notification-context'
import { NotificationContainer } from '@/components/ui/notification-container'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        {children}
        <NotificationContainer />
      </NotificationProvider>
    </SessionProvider>
  )
}



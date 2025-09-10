"use client"

import { useState, useEffect } from "react"
import { formatBrazilTime } from '@/lib/timezone'

export function TerminalHeader() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(formatBrazilTime(now))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black border-b border-primary p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        <div className="text-accent">[WARNING] UNAUTHORIZED ACCESS IS PROHIBITED</div>
        <div className="text-primary">
          STATUS: CONNECTED | ENCRYPTION: ACTIVE | TRACE: DISABLED | TIME: {currentTime}
        </div>
        <div className="text-foreground">user@underground:~$ access_network --crew=NO_NPC --clearance=level_3</div>
      </div>
    </div>
  )
}

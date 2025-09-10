"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose?: (id: string) => void
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ id, type, title, message, duration = 5000, onClose, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(id), 300)
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [duration, id, onClose])

    const handleClose = () => {
      setIsVisible(false)
      setTimeout(() => onClose?.(id), 300)
    }

    const getTypeStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-600 border-green-500 text-white'
        case 'error':
          return 'bg-red-600 border-red-500 text-white'
        case 'warning':
          return 'bg-yellow-600 border-yellow-500 text-white'
        case 'info':
          return 'bg-blue-600 border-blue-500 text-white'
        default:
          return 'bg-gray-600 border-gray-500 text-white'
      }
    }

    const getTypeIcon = () => {
      switch (type) {
        case 'success':
          return '✓'
        case 'error':
          return '✕'
        case 'warning':
          return '⚠'
        case 'info':
          return 'ℹ'
        default:
          return '•'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative max-w-sm w-full rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
          getTypeStyles(),
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-lg font-bold">
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-black/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
)
Notification.displayName = "Notification"

export { Notification }



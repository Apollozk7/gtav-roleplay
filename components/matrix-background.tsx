"use client"

import { useEffect, useRef } from "react"

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrix =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`!アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01010101"
    const matrixArray = matrix.split("")

    const fontSize = 8
    const columns = canvas.width / fontSize

    const drops: number[] = []
    const speeds: number[] = []
    const brightness: number[] = []

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.floor((Math.random() * canvas.height) / fontSize)
      speeds[x] = Math.random() * 0.5 + 0.5 // Speed between 0.5 and 1
      brightness[x] = Math.random() * 0.5 + 0.5 // Brightness between 0.5 and 1
    }

    function draw() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]

        const isSpecial = Math.random() < 0.02
        const alpha = brightness[i]

        if (isSpecial) {
          ctx.fillStyle = `rgba(255, 0, 0, ${alpha})` // Occasional red characters
        } else {
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})` // Terminal green
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
          speeds[i] = Math.random() * 0.5 + 0.5 // Randomize speed on reset
          brightness[i] = Math.random() * 0.5 + 0.5 // Randomize brightness on reset
        }
        drops[i] += speeds[i]
      }
    }

    const interval = setInterval(draw, 25)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const newColumns = canvas.width / fontSize
      drops.length = newColumns
      speeds.length = newColumns
      brightness.length = newColumns

      for (let x = 0; x < newColumns; x++) {
        if (drops[x] === undefined) {
          drops[x] = Math.floor((Math.random() * canvas.height) / fontSize)
          speeds[x] = Math.random() * 0.5 + 0.5
          brightness[x] = Math.random() * 0.5 + 0.5
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="matrix-bg" />
}

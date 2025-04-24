"use client"

import { useEffect, useRef } from "react"

interface PlaceholderImageProps {
  width: number
  height: number
  text: string
  className?: string
}

export function PlaceholderImage({ width, height, text, className = "" }: PlaceholderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Definir tamanho do canvas
    canvas.width = width
    canvas.height = height

    // Desenhar fundo
    ctx.fillStyle = "#5499c7" // Cor azul para os fenícios
    ctx.fillRect(0, 0, width, height)

    // Desenhar borda
    ctx.strokeStyle = "#2e86c1"
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, width - 8, height - 8)

    // Desenhar texto
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)

    // Desenhar símbolo fenício (simplificado)
    ctx.beginPath()
    ctx.moveTo(width / 2, height / 4)
    ctx.lineTo(width / 2 + 20, height / 4 + 30)
    ctx.lineTo(width / 2 - 20, height / 4 + 30)
    ctx.closePath()
    ctx.fillStyle = "#f8e3a3" // Cor âmbar clara
    ctx.fill()
  }, [width, height, text])

  return <canvas ref={canvasRef} className={className} />
}

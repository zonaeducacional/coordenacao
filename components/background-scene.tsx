"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface BackgroundSceneProps {
  civilization: string | null
  gameStarted: boolean
}

export function BackgroundScene({ civilization, gameStarted }: BackgroundSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Partículas flutuantes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajusta o tamanho do canvas para preencher a tela
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Cria partículas
    const particleCount = 50
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }[] = []

    // Cores baseadas na civilização
    let colors = ["#f8e3a3", "#f3d27a", "#e9b949"]
    if (gameStarted) {
      if (civilization === "sumerios") {
        colors = ["#f8e3a3", "#e9b949", "#d4a017"]
      } else if (civilization === "acadios") {
        colors = ["#f8e3a3", "#c0392b", "#922b21"]
      } else if (civilization === "fenicios") {
        colors = ["#f8e3a3", "#5499c7", "#2e86c1"]
      }
    }

    // Inicializa partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    // Animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenha partículas
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Move partículas
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebate nas bordas
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [civilization, gameStarted])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* Elementos decorativos baseados na civilização */}
      {gameStarted && (
        <>
          {civilization === "sumerios" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
              className="fixed bottom-0 left-0 w-full h-32 bg-contain bg-repeat-x bg-bottom pointer-events-none z-0"
              style={{ backgroundImage: "url('/images/ziggurat-silhouette.png')" }}
            />
          )}

          {civilization === "acadios" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
              className="fixed bottom-0 left-0 w-full h-32 bg-contain bg-repeat-x bg-bottom pointer-events-none z-0"
              style={{ backgroundImage: "url('/images/akkadian-silhouette.png')" }}
            />
          )}

          {civilization === "fenicios" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1 }}
              className="fixed bottom-0 left-0 w-full h-32 bg-contain bg-repeat-x bg-bottom pointer-events-none z-0"
              style={{ backgroundImage: "url('/images/ship-silhouette.png')" }}
            />
          )}
        </>
      )}
    </>
  )
}

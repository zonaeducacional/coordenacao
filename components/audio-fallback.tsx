"use client"

import { useEffect, useState } from "react"

// Este componente cria um AudioContext e um buffer vazio como fallback
// para quando os arquivos de áudio não estão disponíveis
export function AudioFallback() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Verificar se o AudioContext está disponível
    if (window.AudioContext || window.webkitAudioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const context = new AudioContextClass()
      setAudioContext(context)

      // Criar um buffer vazio
      const emptyBuffer = context.createBuffer(2, 44100, 44100)

      // Criar uma fonte de áudio e conectá-la ao destino
      const source = context.createBufferSource()
      source.buffer = emptyBuffer
      source.connect(context.destination)

      // Não iniciar a reprodução automaticamente
      // source.start()

      return () => {
        // Fechar o contexto de áudio quando o componente for desmontado
        if (context.state !== "closed") {
          context.close()
        }
      }
    }
  }, [])

  // Este componente não renderiza nada visualmente
  return null
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type SoundType = "background" | "click" | "start" | "choice" | "success" | "failure" | "achievement" | "victory"

export function useAudio() {
  // Usar useRef para armazenar os elementos de áudio para evitar re-renderizações
  const audioElementsRef = useRef<Record<SoundType, HTMLAudioElement | null>>({
    background: null,
    click: null,
    start: null,
    choice: null,
    success: null,
    failure: null,
    achievement: null,
    victory: null,
  })

  // Estado para controlar se o áudio está tocando
  const [isPlaying, setIsPlaying] = useState(false)

  // Estado para controlar se o áudio foi carregado
  const [audioLoaded, setAudioLoaded] = useState(false)

  // Flag para evitar múltiplas inicializações
  const initRef = useRef(false)

  // Contador de tentativas de carregamento
  const loadAttemptsRef = useRef(0)

  // Inicializa os elementos de áudio apenas uma vez
  useEffect(() => {
    // Evitar execução no servidor
    if (typeof window === "undefined") return

    // Evitar múltiplas inicializações
    if (initRef.current) return

    initRef.current = true

    try {
      // Função para criar um elemento de áudio com tratamento de erro
      const createAudio = (src: string): HTMLAudioElement => {
        const audio = new Audio()

        // Configurar o src
        audio.src = src

        // Adicionar tratamento de erro - SEM DESESTRUTURAÇÃO
        audio.onerror = () => {
          console.warn(`Não foi possível carregar o áudio: ${src}`)

          // Tentar novamente com um formato diferente se for a primeira tentativa
          if (loadAttemptsRef.current < 3) {
            loadAttemptsRef.current++

            // Criar um AudioContext como fallback
            try {
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext
              if (AudioContext) {
                const context = new AudioContext()
                const oscillator = context.createOscillator()
                const gainNode = context.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(context.destination)

                // Configurar o ganho para um volume baixo
                gainNode.gain.value = 0.1

                // Substituir o método play
                audio.play = () => {
                  oscillator.frequency.value = 440 // nota A4
                  oscillator.start()
                  return Promise.resolve()
                }

                // Substituir o método pause
                audio.pause = () => {
                  try {
                    oscillator.stop()
                  } catch (err) {
                    // Ignorar erros ao parar o oscilador
                  }
                }

                console.log("Usando AudioContext como fallback")
              }
            } catch (err) {
              console.warn("Fallback de áudio falhou")
            }
          }

          // Se todas as tentativas falharem, criar métodos vazios
          if (loadAttemptsRef.current >= 3) {
            // Criar um método play que retorna uma Promise resolvida
            audio.play = () => Promise.resolve()

            // Criar um método pause vazio
            audio.pause = () => {}
          }
        }

        // Adicionar evento de carregamento bem-sucedido
        audio.oncanplaythrough = () => {
          console.log(`Áudio carregado com sucesso: ${src}`)
        }

        return audio
      }

      // Criar elementos de áudio
      const audioElements: Record<SoundType, HTMLAudioElement> = {
        background: createAudio("/sounds/background-music.mp3"),
        click: createAudio("/sounds/click.mp3"),
        start: createAudio("/sounds/start-game.mp3"),
        choice: createAudio("/sounds/choice.mp3"),
        success: createAudio("/sounds/success.mp3"),
        failure: createAudio("/sounds/failure.mp3"),
        achievement: createAudio("/sounds/achievement.mp3"),
        victory: createAudio("/sounds/victory.mp3"),
      }

      // Configurações
      audioElements.background.loop = true
      audioElements.background.volume = 0.3

      // Pré-carregar os sons
      Object.values(audioElements).forEach((audio) => {
        try {
          audio.load()
        } catch (err) {
          // Ignorar erros de carregamento
        }
      })

      // Configurar volume para outros sons
      Object.entries(audioElements).forEach((entry) => {
        const key = entry[0]
        const audio = entry[1]
        if (key !== "background") {
          audio.volume = 0.5
        }
      })

      // Armazenar os elementos de áudio na ref
      audioElementsRef.current = audioElements

      // Marcar como carregado
      setAudioLoaded(true)
    } catch (err) {
      console.warn("Erro ao inicializar áudio:", err)
    }

    // Limpar quando o componente for desmontado
    return () => {
      try {
        Object.values(audioElementsRef.current).forEach((audio) => {
          if (audio) {
            try {
              audio.pause()
              audio.currentTime = 0
            } catch (err) {
              // Ignorar erros ao pausar
            }
          }
        })
      } catch (err) {
        // Ignorar erros de limpeza
      }
    }
  }, []) // Executar apenas uma vez na montagem

  // Alternar reprodução da música de fundo
  const togglePlay = useCallback(() => {
    try {
      const backgroundAudio = audioElementsRef.current.background
      if (!backgroundAudio) return

      if (isPlaying) {
        backgroundAudio.pause()
        setIsPlaying(false)
      } else {
        // Usar uma Promise para lidar com erros
        backgroundAudio
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            console.warn("Erro ao reproduzir música de fundo")

            // Tentar iniciar o áudio com interação do usuário
            const unlockAudio = () => {
              backgroundAudio
                .play()
                .then(() => {
                  setIsPlaying(true)
                  document.removeEventListener("click", unlockAudio)
                })
                .catch(() => {
                  console.warn("Falha ao desbloquear áudio")
                })
            }

            document.addEventListener("click", unlockAudio, { once: true })
          })
      }
    } catch (err) {
      console.warn("Erro ao alternar reprodução:", err)
    }
  }, [isPlaying])

  // Reproduzir um som específico
  const playSound = useCallback((type: SoundType) => {
    try {
      const audio = audioElementsRef.current[type]
      if (!audio) return

      // Para sons que não são de fundo, reproduzir do início
      if (type !== "background") {
        audio.currentTime = 0
        audio.play().catch(() => {
          console.warn(`Erro ao reproduzir ${type}`)
        })
      }
    } catch (err) {
      console.warn(`Erro ao reproduzir som ${type}:`, err)
    }
  }, [])

  // Parar todos os sons
  const stopAllSounds = useCallback(() => {
    try {
      Object.values(audioElementsRef.current).forEach((audio) => {
        if (audio) {
          try {
            audio.pause()
            audio.currentTime = 0
          } catch (err) {
            // Ignorar erros ao pausar
          }
        }
      })
      setIsPlaying(false)
    } catch (err) {
      console.warn("Erro ao parar todos os sons:", err)
    }
  }, [])

  // Função para verificar se o áudio está disponível
  const checkAudioAvailability = useCallback(() => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      return context.state !== "suspended"
    } catch (err) {
      console.warn("AudioContext não suportado")
      return false
    }
  }, [])

  return {
    isPlaying,
    togglePlay,
    playSound,
    stopAllSounds,
    audioLoaded,
    checkAudioAvailability,
  }
}

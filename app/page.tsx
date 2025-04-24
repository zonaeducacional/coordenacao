"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Info, BookOpen, Home, Scroll } from "lucide-react"
import { motion } from "framer-motion"

import { civilizations, events, type Event, type Choice, type Resources } from "@/lib/game-data"
import { Timeline } from "@/components/timeline"
import { CivilizationCard } from "@/components/civilization-card"
import { EventCard } from "@/components/event-card"
import { ResourceDisplay } from "@/components/resource-display"
import { BackgroundScene } from "@/components/background_scene"
import { Footer } from "@/components/footer"
import { PlaceholderImage } from "@/components/placeholder-image"
import { useAudio } from "@/hooks/use-audio"

export default function RPGGame() {
  const [selectedCivilization, setSelectedCivilization] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [resources, setResources] = useState<Resources>({ grains: 0, wood: 0, gold: 0, people: 0 })
  const [progress, setProgress] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [showEventResult, setShowEventResult] = useState(false)
  const [eventResult, setEventResult] = useState("")
  const [year, setYear] = useState(-3000)
  const [season, setSeason] = useState("Primavera")
  const [gameOver, setGameOver] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState<"success" | "failure" | "neutral">("neutral")
  // Remova a verificação de phoenicianImageLoaded e use diretamente a imagem
  // const [phoenicianImageLoaded, setPhoenicianImageLoaded] = useState(false)

  const { isPlaying, togglePlay, playSound, stopAllSounds, audioLoaded } = useAudio()

  // Usar ref para controlar se a música já foi iniciada
  const musicStartedRef = useRef(false)

  const seasons = ["Primavera", "Verão", "Outono", "Inverno"]

  // Verificar se a imagem dos fenícios existe
  // useEffect(() => {
  //   try {
  //     const img = new Image()
  //     img.src = "/images/phoenician.png"

  //     // Corrigido: Não desestruturar eventos
  //     img.onload = () => {
  //       setPhoenicianImageLoaded(true)
  //     }

  //     // Corrigido: Não desestruturar eventos
  //     img.onerror = () => {
  //       setPhoenicianImageLoaded(false)
  //     }

  //     // Limpar o evento quando o componente for desmontado
  //     return () => {
  //       img.onload = null
  //       img.onerror = null
  //     }
  //   } catch (err) {
  //     console.warn("Erro ao carregar imagem dos fenícios")
  //     setPhoenicianImageLoaded(false)
  //   }
  // }, [])

  // Efeito para verificar vitória
  useEffect(() => {
    try {
      if (progress >= 100) {
        setGameOver(true)
        if (audioLoaded) {
          playSound("victory")
        }
      }
    } catch (err) {
      console.warn("Erro ao verificar vitória")
    }
  }, [progress, playSound, audioLoaded])

  // Efeito para iniciar música de fundo
  useEffect(() => {
    try {
      // Só iniciar a música se o áudio estiver carregado e ainda não tiver sido iniciada
      if (audioLoaded && !musicStartedRef.current) {
        // Marcar que a música já foi iniciada para evitar múltiplas chamadas
        musicStartedRef.current = true

        // Usar setTimeout para evitar problemas de loop
        const timer = setTimeout(() => {
          if (!isPlaying) {
            togglePlay()
          }
        }, 500)

        return () => clearTimeout(timer)
      }
    } catch (err) {
      console.warn("Erro ao iniciar música de fundo")
    }
  }, [audioLoaded, isPlaying, togglePlay])

  // Efeito para limpar sons ao desmontar
  useEffect(() => {
    return () => {
      try {
        stopAllSounds()
      } catch (err) {
        console.warn("Erro ao limpar sons")
      }
    }
  }, [stopAllSounds])

  const selectCivilization = (civ: string) => {
    try {
      setSelectedCivilization(civ)
      if (audioLoaded) {
        playSound("click")
      }
    } catch (err) {
      console.warn("Erro ao selecionar civilização")
    }
  }

  const startGame = () => {
    try {
      if (!selectedCivilization) {
        return
      }

      if (audioLoaded) {
        playSound("start")
      }

      // Configura recursos iniciais baseados na civilização
      switch (selectedCivilization) {
        case "sumerios":
          setResources({ grains: 4, wood: 3, gold: 1, people: 10 })
          break
        case "acadios":
          setResources({ grains: 5, wood: 3, gold: 1, people: 11 })
          break
        case "fenicios":
          setResources({ grains: 3, wood: 4, gold: 2, people: 8 })
          break
      }

      setProgress(0)
      setAchievements([])
      setCurrentEventIndex(0)
      setGameStarted(true)
      setGameLog(["Sua jornada como líder começou!"])
      setYear(-3000)
      setSeason("Primavera")
    } catch (err) {
      console.warn("Erro ao iniciar jogo")
    }
  }

  const addMessage = (text: string) => {
    try {
      setGameLog((prev) => [text, ...prev])
    } catch (err) {
      console.warn("Erro ao adicionar mensagem")
    }
  }

  const addAchievement = (name: string) => {
    try {
      if (!achievements.includes(name)) {
        setAchievements((prev) => [...prev, name])
        addMessage(`🏆 Conquista desbloqueada: ${name}`)
        if (audioLoaded) {
          playSound("achievement")
        }
      }
    } catch (err) {
      console.warn("Erro ao adicionar conquista")
    }
  }

  const handleChoice = (choice: Choice) => {
    try {
      if (audioLoaded) {
        playSound("choice")
      }

      // Aplica o efeito da escolha
      const result = choice.effect({
        resources,
        setResources,
        progress,
        setProgress,
        addAchievement,
        addMessage,
        civilization: selectedCivilization || "",
      })

      // Determina o tipo de animação baseado no resultado
      if (result.includes("+") && !result.includes("-")) {
        setAnimationType("success")
        if (audioLoaded) {
          playSound("success")
        }
      } else if (result.includes("-") && !result.includes("+")) {
        setAnimationType("failure")
        if (audioLoaded) {
          playSound("failure")
        }
      } else {
        setAnimationType("neutral")
      }

      // Mostra a animação
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 1500)

      // Mostra o resultado
      setEventResult(result)
      setShowEventResult(true)

      // Avança a estação e o ano
      const currentSeasonIndex = seasons.indexOf(season)
      const newSeasonIndex = (currentSeasonIndex + 1) % seasons.length
      setSeason(seasons[newSeasonIndex])

      // Se completou um ciclo de estações, avança o ano
      if (newSeasonIndex === 0) {
        setYear((prev) => prev + 1)
      }
    } catch (err) {
      console.warn("Erro ao processar escolha")
    }
  }

  const nextEvent = () => {
    try {
      if (audioLoaded) {
        playSound("click")
      }
      setShowEventResult(false)

      // Verifica se o jogo terminou
      if (progress >= 100) {
        setGameOver(true)
        return
      }

      // Escolhe próximo evento aleatoriamente
      const filteredEvents = events.filter(
        (event) => !event.finalEvent && (!event.civilization || event.civilization === selectedCivilization),
      )

      if (filteredEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredEvents.length)
        const nextEventIndex = events.findIndex((e) => e.id === filteredEvents[randomIndex].id)
        setCurrentEventIndex(nextEventIndex)
      }
    } catch (err) {
      console.warn("Erro ao avançar para o próximo evento")
    }
  }

  const restartGame = () => {
    try {
      if (audioLoaded) {
        playSound("start")
      }
      setSelectedCivilization(null)
      setGameStarted(false)
      setGameOver(false)
      setProgress(0)
    } catch (err) {
      console.warn("Erro ao reiniciar jogo")
    }
  }

  const currentEvent: Event = events[currentEventIndex]

  // Substitua a função renderPhoenicianImage por:
  const renderPhoenicianImage = () => {
    try {
      return (
        <Image
          src="/images/phoenician.png"
          alt="Fenícios"
          width={80}
          height={80}
          className="rounded-full mb-4 border-4 border-amber-400"
        />
      )
    } catch (err) {
      console.warn("Erro ao renderizar imagem dos fenícios")
      return (
        <PlaceholderImage
          width={80}
          height={80}
          text="Fenícios"
          className="rounded-full mb-4 border-4 border-amber-400"
        />
      )
    }
  }

  const handleTabClick = (sound: boolean) => {
    try {
      if (sound && audioLoaded) {
        playSound("click")
      }
    } catch (err) {
      console.warn("Erro ao reproduzir som de clique")
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 relative overflow-hidden pb-16">
      <BackgroundScene civilization={selectedCivilization} gameStarted={gameStarted} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center text-amber-900 mb-2">Aventura no Crescente Fértil</h1>
          <p className="text-center text-amber-800 mb-6">
            Um RPG educativo sobre as primeiras civilizações da humanidade
          </p>
        </motion.div>

        <Tabs defaultValue="game">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game" className="flex items-center gap-2" onClick={() => handleTabClick(true)}>
              <Home size={16} />
              <span>Jogo</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2" onClick={() => handleTabClick(true)}>
              <BookOpen size={16} />
              <span>Informações</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2" onClick={() => handleTabClick(true)}>
              <Info size={16} />
              <span>Sobre</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-center text-amber-900">Escolha sua Civilização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center mb-6">
                      Você será o líder de uma das primeiras civilizações do Crescente Fértil. Cada uma tem habilidades
                      e desafios únicos!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <CivilizationCard
                        key="sumerios"
                        id="sumerios"
                        civilization={civilizations.sumerios}
                        isSelected={selectedCivilization === "sumerios"}
                        onSelect={selectCivilization}
                      />
                      <CivilizationCard
                        key="acadios"
                        id="acadios"
                        civilization={civilizations.acadios}
                        isSelected={selectedCivilization === "acadios"}
                        onSelect={selectCivilization}
                      />
                      <div
                        className="cursor-pointer transition-all duration-300 hover:shadow-md"
                        onClick={() => selectCivilization("fenicios")}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedCivilization === "fenicios"
                              ? "bg-amber-200 border-amber-500 shadow-md"
                              : "bg-amber-100/50 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          <CardContent className="p-6 flex flex-col items-center">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                            >
                              {renderPhoenicianImage()}
                            </motion.div>
                            <h3 className="font-bold text-amber-900 mb-1">{civilizations.fenicios.name}</h3>
                            <p className="text-sm text-center text-amber-800">{civilizations.fenicios.description}</p>

                            <div className="mt-4 text-xs text-amber-700">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>Grãos: {civilizations.fenicios.startingResources.grains}</div>
                                <div>Madeira: {civilizations.fenicios.startingResources.wood}</div>
                                <div>Ouro: {civilizations.fenicios.startingResources.gold}</div>
                                <div>Pessoas: {civilizations.fenicios.startingResources.people}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={startGame}
                        disabled={!selectedCivilization}
                        className="mx-auto block bg-amber-700 hover:bg-amber-800"
                      >
                        Começar Jornada
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-center text-amber-900">
                          {civilizations[selectedCivilization || "sumerios"].name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-center mb-4">
                          <motion.div
                            animate={{
                              rotateY: [0, 360],
                            }}
                            transition={{
                              duration: 10,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="relative"
                          >
                            {/* E também substitua a parte onde verifica phoenicianImageLoaded:
                            {selectedCivilization === "fenicios" && !phoenicianImageLoaded ? (
                              <PlaceholderImage
                                width={80}
                                height={80}
                                text="Fenícios"
                                className="rounded-full border-4 border-amber-700"
                              />
                            ) : (
                              <Image
                                src={civilizations[selectedCivilization || "sumerios"].image}
                                alt={civilizations[selectedCivilization || "sumerios"].name}
                                width={80}
                                height={80}
                                className="rounded-full border-4 border-amber-700"
                              />
                            )} */}
                            {/* Por: */}
                            <Image
                              src={civilizations[selectedCivilization || "sumerios"].image}
                              alt={civilizations[selectedCivilization || "sumerios"].name}
                              width={80}
                              height={80}
                              className="rounded-full border-4 border-amber-700"
                            />
                          </motion.div>
                        </div>

                        <div className="text-center mb-4">
                          <div className="text-sm text-amber-800">Ano: {year}</div>
                          <div className="text-sm text-amber-800">Estação: {season}</div>
                        </div>

                        <ResourceDisplay resources={resources} />

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Progresso Civilizacional</span>
                            <span className="text-sm">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-amber-900">
                          <Trophy size={18} />
                          <span>Conquistas</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[150px] pr-4">
                          <div className="flex flex-wrap gap-2">
                            {achievements.length > 0 ? (
                              achievements.map((achievement, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                  <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300">
                                    {achievement}
                                  </Badge>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-sm text-amber-700 italic">
                                Conquiste feitos importantes para desbloquear conquistas!
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-amber-900">
                          <Scroll size={18} />
                          <span>Registro Histórico</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px] pr-4">
                          <div className="space-y-2">
                            {gameLog.map((log, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index === 0 ? 0.1 : 0 }}
                              >
                                <p className="text-sm border-l-2 border-amber-300 pl-2">{log}</p>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <EventCard event={currentEvent} onChoiceSelect={handleChoice} />
                </motion.div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center text-amber-900">Informações sobre o Crescente Fértil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">O que foi o Crescente Fértil?</h3>
                        <p>
                          O Crescente Fértil foi uma região no Oriente Médio onde surgiram as primeiras civilizações
                          humanas, graças ao solo fértil criado pelos rios Tigre, Eufrates e Nilo.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">Sumérios</h3>
                        <p>
                          Os sumérios foram a primeira civilização conhecida, inventando a escrita cuneiforme e
                          construindo grandes zigurates. Desenvolveram-se na Mesopotâmia por volta de 4000 a.C.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">Agricultura</h3>
                        <p>
                          A agricultura surgiu no Crescente Fértil por volta de 10.000 a.C., permitindo que os humanos
                          se estabelecessem em um local fixo e desenvolvessem as primeiras cidades.
                        </p>
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">Acádios</h3>
                        <p>
                          Os acádios foram uma civilização semita que conquistou a Suméria sob o comando de Sargão, o
                          Grande, por volta de 2334 a.C. Criaram o primeiro império conhecido da história, unificando a
                          Mesopotâmia.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">Fenícios</h3>
                        <p>
                          Os fenícios foram grandes navegadores e comerciantes, inventando o primeiro alfabeto fonético
                          que influenciou muitas línguas modernas. Estabeleceram-se na costa do Mediterrâneo por volta
                          de 1500 a.C.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
                      >
                        <h3 className="font-bold text-amber-900 mb-2">Escrita</h3>
                        <p>
                          A escrita cuneiforme suméria é considerada a primeira forma de escrita, surgindo por volta de
                          3400 a.C. para registrar transações comerciais. Os acádios adaptaram a escrita suméria para
                          sua própria língua.
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-amber-900 mb-4">Linha do Tempo</h3>
                    <Timeline />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="about">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center text-amber-900">Sobre o Jogo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-3xl mx-auto space-y-4">
                    <p>
                      Este é um jogo educativo desenvolvido para ensinar sobre as primeiras civilizações do Crescente
                      Fértil de forma interativa e divertida.
                    </p>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-amber-100 p-4 rounded-lg">
                      <h3 className="font-bold text-amber-900 mb-2">Objetivo</h3>
                      <p>
                        Guiar sua civilização através de desafios históricos, tomando decisões que afetam seu
                        desenvolvimento e tentando alcançar 100% de progresso civilizacional.
                      </p>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-amber-100 p-4 rounded-lg">
                      <h3 className="font-bold text-amber-900 mb-2">Como Jogar</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Escolha uma das três civilizações históricas, cada uma com recursos iniciais diferentes.
                        </li>
                        <li>A cada turno, você enfrentará um evento histórico e deverá tomar uma decisão.</li>
                        <li>
                          Suas escolhas afetarão seus recursos (grãos, madeira, ouro e pessoas) e o progresso da sua
                          civilização.
                        </li>
                        <li>Gerencie seus recursos com sabedoria para sobreviver e prosperar.</li>
                        <li>Desbloqueie conquistas realizando feitos importantes.</li>
                      </ol>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="bg-amber-100 p-4 rounded-lg">
                      <h3 className="font-bold text-amber-900 mb-2">Valor Educativo</h3>
                      <p>
                        Este jogo foi desenvolvido para complementar o estudo de História Antiga, abordando temas como:
                      </p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Desenvolvimento das primeiras civilizações</li>
                        <li>Importância da agricultura e dos recursos naturais</li>
                        <li>Invenções e descobertas importantes (escrita, roda, etc.)</li>
                        <li>Desafios enfrentados pelas sociedades antigas</li>
                        <li>Diferenças entre as civilizações do Crescente Fértil</li>
                      </ul>
                    </motion.div>

                    <p className="text-center italic">
                      Conteúdo educativo alinhado com o currículo de História do 6º ano.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Animações de feedback */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className={`text-6xl ${
              animationType === "success"
                ? "text-green-500"
                : animationType === "failure"
                  ? "text-red-500"
                  : "text-amber-500"
            }`}
          >
            {animationType === "success" ? "✓" : animationType === "failure" ? "✗" : "!"}
          </motion.div>
        </div>
      )}

      {/* Diálogo de resultado do evento */}
      <AlertDialog open={showEventResult}>
        <AlertDialogContent className="bg-amber-50 border-amber-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Resultado</AlertDialogTitle>
            <AlertDialogDescription>{eventResult}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <AlertDialogAction onClick={nextEvent} className="bg-amber-700 hover:bg-amber-800">
                Continuar
              </AlertDialogAction>
            </motion.div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de fim de jogo */}
      <AlertDialog open={gameOver}>
        <AlertDialogContent className="bg-amber-50 border-amber-200">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">Vitória!</AlertDialogTitle>
              <div className="py-4 flex justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Image src="/images/victory-trophy.png" alt="Troféu de Vitória" width={120} height={120} />
                </motion.div>
              </div>
              <AlertDialogDescription className="text-center">
                Sua civilização alcançou grande desenvolvimento e se tornou uma potência do mundo antigo!
                <div className="mt-4">
                  <p className="font-medium">Conquistas desbloqueadas: {achievements.length}</p>
                  <p className="font-medium">Anos passados: {Math.abs(year - -3000)}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AlertDialogAction onClick={restartGame} className="bg-amber-700 hover:bg-amber-800">
                  Jogar Novamente
                </AlertDialogAction>
              </motion.div>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rodapé com informações */}
      <Footer
        civilization={selectedCivilization}
        year={year}
        season={season}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
    </div>
  )
}

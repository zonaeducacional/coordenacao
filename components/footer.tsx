"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Info, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FooterProps {
  civilization: string | null
  year: number
  season: string
  isPlaying: boolean
  togglePlay: () => void
}

export function Footer({ civilization, year, season, isPlaying, togglePlay }: FooterProps) {
  const [civilizationInfo, setCivilizationInfo] = useState("")

  // Atualiza as informações da civilização quando ela muda
  useEffect(() => {
    try {
      if (civilization === "sumerios") {
        setCivilizationInfo(
          "Os sumérios foram a primeira civilização conhecida, inventando a escrita cuneiforme e construindo grandes zigurates.",
        )
      } else if (civilization === "acadios") {
        setCivilizationInfo(
          "Os acádios criaram o primeiro império conhecido da história, unificando a Mesopotâmia sob o comando de Sargão, o Grande.",
        )
      } else if (civilization === "fenicios") {
        setCivilizationInfo(
          "Os fenícios foram grandes navegadores e comerciantes, inventando o primeiro alfabeto fonético que influenciou muitas línguas modernas.",
        )
      } else {
        setCivilizationInfo("Selecione uma civilização para começar sua jornada no Crescente Fértil.")
      }
    } catch (err) {
      console.warn("Erro ao atualizar informações da civilização")
      setCivilizationInfo("Informações não disponíveis.")
    }
  }, [civilization])

  const handleTogglePlay = () => {
    try {
      togglePlay()
    } catch (err) {
      console.warn("Erro ao alternar reprodução de áudio")
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 w-full bg-amber-100/90 backdrop-blur-sm border-t border-amber-200 py-2 px-4 z-20"
    >
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2 text-amber-900">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={16} className="text-amber-700" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">Informações sobre a civilização selecionada</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-sm md:text-base">{civilizationInfo}</p>
        </div>

        <div className="flex items-center space-x-4">
          {civilization && (
            <div className="text-sm text-amber-800 hidden md:block">
              <span className="mr-2">Ano: {year}</span>
              <span>Estação: {season}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleTogglePlay}
            className="rounded-full bg-amber-100 hover:bg-amber-200 border-amber-300"
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
        </div>
      </div>
    </motion.footer>
  )
}

"use client"

import { GrapeIcon as Grain, Trees, Coins, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import type { Resources } from "@/lib/game-data"

interface ResourceDisplayProps {
  resources: Resources
}

export function ResourceDisplay({ resources }: ResourceDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 p-2 rounded-md cursor-help"
            >
              <Grain size={18} className="text-amber-700" />
              <span className="font-medium">{resources.grains}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Grãos - Alimento para seu povo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 p-2 rounded-md cursor-help"
            >
              <Trees size={18} className="text-amber-700" />
              <span className="font-medium">{resources.wood}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Madeira - Material de construção</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 p-2 rounded-md cursor-help"
            >
              <Coins size={18} className="text-amber-700" />
              <span className="font-medium">{resources.gold}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ouro - Riqueza e comércio</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 p-2 rounded-md cursor-help"
            >
              <Users size={18} className="text-amber-700" />
              <span className="font-medium">{resources.people}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pessoas - População da sua civilização</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

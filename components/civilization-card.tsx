"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Civilization } from "@/lib/game-data"

interface CivilizationCardProps {
  id: string
  civilization: Civilization
  isSelected: boolean
  onSelect: (id: string) => void
}

export function CivilizationCard({ id, civilization, isSelected, onSelect }: CivilizationCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
          isSelected ? "bg-amber-200 border-amber-500 shadow-md" : "bg-amber-100/50 border-amber-200 hover:bg-amber-100"
        }`}
        onClick={() => onSelect(id)}
      >
        <CardContent className="p-6 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <Image
              src={civilization.image || "/placeholder.svg"}
              alt={civilization.name}
              width={80}
              height={80}
              className={`rounded-full mb-4 border-4 ${isSelected ? "border-amber-700" : "border-amber-400"}`}
            />
          </motion.div>
          <h3 className="font-bold text-amber-900 mb-1">{civilization.name}</h3>
          <p className="text-sm text-center text-amber-800">{civilization.description}</p>

          <div className="mt-4 text-xs text-amber-700">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>Grãos: {civilization.startingResources.grains}</div>
              <div>Madeira: {civilization.startingResources.wood}</div>
              <div>Ouro: {civilization.startingResources.gold}</div>
              <div>Pessoas: {civilization.startingResources.people}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

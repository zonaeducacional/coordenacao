"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { Event, Choice } from "@/lib/game-data"

interface EventCardProps {
  event: Event
  onChoiceSelect: (choice: Choice) => void
}

export function EventCard({ event, onChoiceSelect }: EventCardProps) {
  return (
    <Card className="border-amber-200 bg-amber-100/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-amber-900">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-700"
        >
          <p>{event.description}</p>
        </motion.div>

        <div className="space-y-3">
          <h3 className="font-medium text-amber-900">O que você fará?</h3>
          <div className="space-y-2">
            {event.choices.map((choice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 border-amber-300 hover:bg-amber-200 hover:text-amber-900"
                  onClick={() => onChoiceSelect(choice)}
                >
                  {choice.text}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

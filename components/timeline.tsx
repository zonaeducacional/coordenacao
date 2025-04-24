"use client"

import { motion } from "framer-motion"

export function Timeline() {
  const timelineEvents = [
    { year: "10.000 a.C.", text: "Início da agricultura no Crescente Fértil" },
    { year: "4.000 a.C.", text: "Surgimento da civilização Suméria na Mesopotâmia" },
    { year: "3.400 a.C.", text: "Invenção da escrita cuneiforme pelos Sumérios" },
    { year: "2.334 a.C.", text: "Sargão, o Grande, funda o Império Acádio" },
    { year: "2.200 a.C.", text: "Queda do Império Acádio" },
    { year: "1.500 a.C.", text: "Surgimento da civilização Fenícia no litoral mediterrâneo" },
    { year: "1.100 a.C.", text: "Desenvolvimento do alfabeto fenício" },
  ]

  return (
    <div className="relative border-l-2 border-amber-700 pl-8 py-4 ml-4">
      {timelineEvents.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-8 relative last:mb-0"
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute -left-[41px] bg-amber-100 border-2 border-amber-700 rounded-full w-6 h-6"
          ></motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-amber-100 p-3 rounded-lg">
            <h4 className="font-bold text-amber-900">{event.year}</h4>
            <p>{event.text}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

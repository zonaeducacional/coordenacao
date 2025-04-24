import type React from "react"
export interface Resources {
  grains: number
  wood: number
  gold: number
  people: number
}

export interface Civilization {
  name: string
  description: string
  image: string
  startingResources: Resources
  specialAbility?: string
}

export interface EffectProps {
  resources: Resources
  setResources: React.Dispatch<React.SetStateAction<Resources>>
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
  addAchievement: (name: string) => void
  addMessage: (text: string) => void
  civilization: string
}

export interface Choice {
  text: string
  effect: (props: EffectProps) => string
}

export interface Event {
  id: string
  title: string
  description: string
  choices: Choice[]
  civilization?: string
  finalEvent?: boolean
}

export const civilizations: Record<string, Civilization> = {
  sumerios: {
    name: "Sumérios",
    description: "Mestres da escrita e arquitetura",
    image: "/images/sumerian.png",
    startingResources: { grains: 4, wood: 3, gold: 1, people: 10 },
    specialAbility: "Escrita Avançada: Ganham +5% de progresso ao desenvolver tecnologias",
  },
  acadios: {
    name: "Acádios",
    description: "Guerreiros e conquistadores",
    image: "/images/akkadian.png",
    startingResources: { grains: 5, wood: 3, gold: 1, people: 11 },
    specialAbility: "Império Unificado: Ganham +2 pessoas ao vencer conflitos",
  },
  fenicios: {
    name: "Fenícios",
    description: "Grandes navegadores e comerciantes",
    image: "/images/phoenician.png",
    startingResources: { grains: 3, wood: 4, gold: 2, people: 8 },
    specialAbility: "Comerciantes Habilidosos: Ganham +1 ouro ao comerciar",
  },
}

export const events: Event[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao Crescente Fértil!",
    description:
      "Você acaba de se tornar líder do seu povo. Seu objetivo é guiá-los para se tornar uma grande civilização.",
    choices: [
      {
        text: "Começar jornada",
        effect: ({ addMessage }) => {
          addMessage("Sua jornada como líder começou!")
          return "Que sua liderança seja sábia e próspera!"
        },
      },
    ],
  },
  {
    id: "river_flood",
    title: "Cheia do Rio",
    description:
      "As águas do rio estão subindo rapidamente. Isso pode ser uma bênção para a agricultura ou uma ameaça para os assentamentos.",
    choices: [
      {
        text: "Construir diques (custa 2 madeira)",
        effect: ({ resources, setResources, addAchievement, addMessage }) => {
          if (resources.wood >= 2) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 2,
              grains: prev.grains + 3,
            }))
            addAchievement("Engenheiro Hidráulico")
            addMessage("Você construiu diques e salvou suas plantações!")
            return "Seus diques protegeram as plantações. +3 grãos na próxima colheita!"
          } else {
            setResources((prev) => ({
              ...prev,
              grains: Math.max(0, prev.grains - 1),
            }))
            addMessage("Você não tinha madeira suficiente para os diques!")
            return "Você não tem madeira suficiente! As cheias destruíram parte da colheita. -1 grão."
          }
        },
      },
      {
        text: "Fazer oferendas aos deuses do rio",
        effect: ({ resources, setResources, addMessage }) => {
          const success = Math.random() > 0.3
          if (success) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains + 2,
            }))
            addMessage("Os deuses aceitaram suas oferendas!")
            return "As cheias foram moderadas e trouxeram fertilidade. +2 grãos!"
          } else {
            setResources((prev) => ({
              ...prev,
              grains: Math.max(0, prev.grains - 2),
            }))
            addMessage("As oferendas não foram suficientes!")
            return "As oferendas não foram suficientes. As águas destruíram parte das plantações. -2 grãos."
          }
        },
      },
      {
        text: "Evacuar para terrenos mais altos",
        effect: ({ resources, setResources, addMessage }) => {
          setResources((prev) => ({
            ...prev,
            grains: Math.max(0, prev.grains - 1),
            people: prev.people,
          }))
          addMessage("Seu povo se salvou, mas perdeu parte da colheita.")
          return "Seu povo está seguro, mas perdeu parte da colheita. -1 grão."
        },
      },
    ],
  },
  {
    id: "nomad_invasion",
    title: "Invasão Nômade",
    description: "Grupos nômades estão atacando suas terras! Eles ameaçam saquear seus recursos e prejudicar seu povo.",
    choices: [
      {
        text: "Lutar contra os invasores",
        effect: ({ resources, setResources, addMessage, civilization }) => {
          const win = Math.random() > 0.4
          if (win) {
            const peopleGain = civilization === "acadios" ? 2 : 0

            setResources((prev) => ({
              ...prev,
              gold: prev.gold + 1,
              people: prev.people + peopleGain,
            }))

            let message = "Vitória! Seus guerreiros derrotaram os invasores e capturaram seus tesouros. +1 ouro."

            if (civilization === "acadios") {
              addMessage("Como acádios, você incorporou alguns dos nômades ao seu exército!")
              message += " Como acádios, você ganhou +2 pessoas ao incorporar os derrotados."
            } else {
              addMessage("Você derrotou os invasores e tomou seus recursos!")
            }

            return message
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 2),
            }))
            addMessage("Você perdeu a batalha contra os nômades!")
            return "Derrota! Seus guerreiros foram derrotados e alguns foram mortos. -2 pessoas."
          }
        },
      },
      {
        text: "Negociar com os invasores (custa 1 ouro)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.gold >= 1) {
            setResources((prev) => ({
              ...prev,
              gold: prev.gold - 1,
            }))
            addMessage("Você pagou os nômades para irem embora.")
            return "Paz negociada. Os nômades aceitaram seu ouro e foram embora. -1 ouro."
          } else {
            setResources((prev) => ({
              ...prev,
              grains: Math.max(0, prev.grains - 3),
            }))
            addMessage("Sem ouro, você teve que oferecer grãos aos nômades.")
            return "Você não tem ouro. Os nômades aceitaram grãos como pagamento. -3 grãos."
          }
        },
      },
      {
        text: "Oferecer aliança e integração",
        effect: ({ resources, setResources, progress, setProgress, addMessage, civilization }) => {
          const success = Math.random() > 0.5
          if (success) {
            const peopleGain = civilization === "acadios" ? 3 : 2

            setResources((prev) => ({
              ...prev,
              people: prev.people + peopleGain,
            }))
            setProgress((prev) => prev + 5)

            let message = `Aliança formada! Alguns nômades se juntaram à sua civilização. +${peopleGain} pessoas, +5% progresso.`

            if (civilization === "acadios") {
              addMessage("Como acádios, você é habilidoso em integrar outros povos!")
              message =
                "Aliança formada! Como acádios, você integrou mais nômades à sua civilização. +3 pessoas, +5% progresso."
            } else {
              addMessage("Os nômades aceitaram sua oferta e se juntaram ao seu povo!")
            }

            return message
          } else {
            setResources((prev) => ({
              ...prev,
              grains: Math.max(0, prev.grains - 2),
            }))
            addMessage("Os nômades rejeitaram sua oferta e levaram alguns recursos.")
            return "Oferta rejeitada. Os nômades levaram alguns recursos antes de partir. -2 grãos."
          }
        },
      },
    ],
  },
  {
    id: "famine",
    title: "Fome na Cidade",
    description:
      "As colheitas foram ruins e o povo está com fome. A situação pode piorar se não for resolvida rapidamente.",
    choices: [
      {
        text: "Distribuir grãos igualmente (custa 4 grãos)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.grains >= 4) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains - 4,
              people: prev.people + 1,
            }))
            addMessage("Seu povo está grato pela sua generosidade!")
            return "O povo está feliz com sua liderança justa. A população aumentou. -4 grãos, +1 pessoa."
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 2),
            }))
            addMessage("Não havia grãos suficientes e algumas pessoas morreram de fome.")
            return "Não há grãos suficientes. Algumas pessoas morreram de fome. -2 pessoas."
          }
        },
      },
      {
        text: "Racionar comida (custa 2 grãos)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.grains >= 2) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains - 2,
            }))
            addMessage("O racionamento foi suficiente para evitar mortes.")
            return "Racionamento implementado. O povo sobreviveu, mas não está feliz. -2 grãos."
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 1),
            }))
            addMessage("Não havia grãos suficientes nem para o racionamento.")
            return "Grãos insuficientes até para o racionamento. -1 pessoa."
          }
        },
      },
      {
        text: "Organizar expedição de caça",
        effect: ({ resources, setResources, addMessage }) => {
          const success = Math.random() > 0.4
          if (success) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains + 1,
            }))
            addMessage("A expedição de caça foi bem-sucedida!")
            return "A caça foi bem-sucedida! Seu povo conseguiu comida adicional. +1 grão."
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 1),
            }))
            addMessage("A expedição de caça foi perigosa e um caçador não retornou.")
            return "A caça foi perigosa. Um caçador não retornou. -1 pessoa."
          }
        },
      },
    ],
  },
  {
    id: "writing",
    title: "Descoberta da Escrita",
    description:
      "Seus escribas desenvolveram um sistema para registrar informações usando símbolos em tábuas de argila.",
    choices: [
      {
        text: "Investir na escrita (custa 1 ouro)",
        effect: ({ resources, setResources, progress, setProgress, addAchievement, addMessage, civilization }) => {
          if (resources.gold >= 1) {
            setResources((prev) => ({
              ...prev,
              gold: prev.gold - 1,
            }))

            // Bônus para sumérios
            const progressBonus = civilization === "sumerios" ? 25 : 20

            setProgress((prev) => prev + progressBonus)
            addAchievement("Inventor da Escrita")
            addMessage("Sua civilização avançou com a escrita!")

            if (civilization === "sumerios") {
              return `A escrita cuneiforme revoluciona sua sociedade! +${progressBonus}% progresso (bônus sumério).`
            } else {
              return `A escrita acelera seu progresso! +${progressBonus}% progresso civilizacional.`
            }
          } else {
            addMessage("Você não tem ouro para investir na escrita.")
            return "Você não tem ouro para investir. A escrita permanece como uma curiosidade."
          }
        },
      },
      {
        text: "Focar apenas em registros comerciais",
        effect: ({ progress, setProgress, addMessage }) => {
          setProgress((prev) => prev + 10)
          addMessage("A escrita é usada apenas para registros comerciais.")
          return "Você limitou a escrita aos registros comerciais. +10% progresso."
        },
      },
      {
        text: "Ignorar a escrita",
        effect: ({ addMessage }) => {
          addMessage("Você decidiu que a escrita não é importante.")
          return "Você perdeu uma oportunidade de progresso. A tradição oral continua sendo o único meio de transmitir conhecimento."
        },
      },
    ],
    civilization: "sumerios",
  },
  {
    id: "trade_opportunity",
    title: "Oportunidade Comercial",
    description: "Mercadores estrangeiros oferecem uma rota comercial lucrativa com terras distantes.",
    choices: [
      {
        text: "Investir em comércio (custa 2 madeira)",
        effect: ({ resources, setResources, progress, setProgress, addAchievement, addMessage, civilization }) => {
          if (resources.wood >= 2) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 2,
              gold: prev.gold + (civilization === "fenicios" ? 4 : 3),
            }))

            setProgress((prev) => prev + 10)
            addAchievement("Comerciante Experiente")
            addMessage("Seu comércio floresce!")

            if (civilization === "fenicios") {
              return "Rotas comerciais estabelecidas! Como fenícios, vocês são mestres do comércio. -2 madeira, +4 ouro, +10% progresso."
            } else {
              return "Rotas comerciais estabelecidas! -2 madeira, +3 ouro, +10% progresso."
            }
          } else {
            addMessage("Você não tem madeira para construir barcos comerciais.")
            return "Você não tem madeira para construir barcos comerciais. A oportunidade foi perdida."
          }
        },
      },
      {
        text: "Trocar conhecimentos (sem custo)",
        effect: ({ progress, setProgress, addMessage }) => {
          setProgress((prev) => prev + 5)
          addMessage("Você trocou conhecimentos com os mercadores.")
          return "Você trocou conhecimentos com os mercadores estrangeiros. +5% progresso."
        },
      },
      {
        text: "Recusar a oferta",
        effect: ({ addMessage }) => {
          addMessage("Você recusou a oferta comercial.")
          return "Você manteve seus recursos, mas perdeu a oportunidade de expandir seu comércio."
        },
      },
    ],
    civilization: "fenicios",
  },
  {
    id: "military_campaign",
    title: "Campanha Militar",
    description:
      "Seus conselheiros sugerem uma campanha militar para expandir seu território e subjugar povos vizinhos.",
    choices: [
      {
        text: "Liderar uma grande campanha (custa 3 madeira, 2 grãos)",
        effect: ({ resources, setResources, progress, setProgress, addAchievement, addMessage, civilization }) => {
          if (resources.wood >= 3 && resources.grains >= 2) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 3,
              grains: prev.grains - 2,
              gold: prev.gold + 2,
              people: prev.people + (civilization === "acadios" ? 3 : 1),
            }))

            setProgress((prev) => prev + 20)

            if (civilization === "acadios") {
              addAchievement("Conquistador Acádio")
              addMessage("Sua campanha militar foi um grande sucesso! Como acádios, vocês são mestres da guerra!")
              return "Vitória gloriosa! Como acádios, vocês conquistaram novos territórios e povos. -3 madeira, -2 grãos, +2 ouro, +3 pessoas, +20% progresso."
            } else {
              addAchievement("Líder Militar")
              addMessage("Sua campanha militar foi bem-sucedida!")
              return "Vitória! Você expandiu seu território. -3 madeira, -2 grãos, +2 ouro, +1 pessoa, +20% progresso."
            }
          } else {
            addMessage("Recursos insuficientes para a campanha militar.")
            return "Recursos insuficientes para a campanha militar. Seus guerreiros não estão preparados."
          }
        },
      },
      {
        text: "Enviar uma pequena força (custa 1 madeira, 1 grão)",
        effect: ({ resources, setResources, progress, setProgress, addMessage, civilization }) => {
          if (resources.wood >= 1 && resources.grains >= 1) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 1,
              grains: prev.grains - 1,
              gold: prev.gold + 1,
            }))

            setProgress((prev) => prev + 5)

            if (civilization === "acadios") {
              addMessage("Sua pequena força teve algum sucesso.")
              return "Pequena vitória. Você conquistou um pequeno território. -1 madeira, -1 grão, +1 ouro, +5% progresso."
            } else {
              addMessage("Sua pequena força teve algum sucesso.")
              return "Pequena vitória. Você conquistou um pequeno território. -1 madeira, -1 grão, +1 ouro, +5% progresso."
            }
          } else {
            addMessage("Recursos insuficientes até para uma pequena força.")
            return "Recursos insuficientes até para uma pequena força. A campanha foi cancelada."
          }
        },
      },
      {
        text: "Manter a paz",
        effect: ({ progress, setProgress, addMessage }) => {
          setProgress((prev) => prev + 2)
          addMessage("Você decidiu manter a paz com seus vizinhos.")
          return "Você decidiu manter a paz. Seu povo pode se concentrar no desenvolvimento interno. +2% progresso."
        },
      },
    ],
    civilization: "acadios",
  },
  {
    id: "monument",
    title: "Construir um Monumento",
    description: "Seu povo quer construir um grande monumento para mostrar seu poder e honrar os deuses.",
    choices: [
      {
        text: "Construir um grande monumento (custa 3 madeira, 2 ouro)",
        effect: ({ resources, setResources, progress, setProgress, addAchievement, addMessage, civilization }) => {
          if (resources.wood >= 3 && resources.gold >= 2) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 3,
              gold: prev.gold - 2,
            }))

            setProgress((prev) => prev + 25)

            if (civilization === "sumerios") {
              addAchievement("Construtor de Zigurate")
              addMessage("Seu zigurate impressiona todos!")
              return "Zigurate concluído! Este imponente templo em forma de torre demonstra seu poder. +25% progresso."
            } else if (civilization === "acadios") {
              addAchievement("Construtor de Palácio")
              addMessage("Seu palácio impressiona todos!")
              return "Palácio concluído! Este monumento demonstra o poder do seu império. +25% progresso."
            } else {
              addAchievement("Construtor de Templo")
              addMessage("Seu templo impressiona todos!")
              return "Templo concluído! Este monumento demonstra seu poder. +25% progresso."
            }
          } else {
            addMessage("Recursos insuficientes para a construção.")
            return "Recursos insuficientes para a construção. O projeto foi adiado."
          }
        },
      },
      {
        text: "Construir um monumento menor (custa 1 madeira, 1 ouro)",
        effect: ({ resources, setResources, progress, setProgress, addMessage, civilization }) => {
          if (resources.wood >= 1 && resources.gold >= 1) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 1,
              gold: prev.gold - 1,
            }))

            setProgress((prev) => prev + 10)

            if (civilization === "sumerios") {
              addMessage("Você construiu um pequeno zigurate.")
              return "Pequeno zigurate concluído. +10% progresso."
            } else if (civilization === "acadios") {
              addMessage("Você construiu um pequeno palácio.")
              return "Pequeno palácio concluído. +10% progresso."
            } else {
              addMessage("Você construiu um pequeno templo.")
              return "Pequeno templo concluído. +10% progresso."
            }
          } else {
            addMessage("Recursos insuficientes até para o monumento menor.")
            return "Recursos insuficientes até para o monumento menor. O projeto foi cancelado."
          }
        },
      },
      {
        text: "Recusar a construção",
        effect: ({ addMessage }) => {
          addMessage("Você decidiu não construir um monumento.")
          return "Você decidiu focar em necessidades mais práticas. O povo está um pouco desapontado."
        },
      },
    ],
  },
  {
    id: "disease",
    title: "Doença na Cidade",
    description: "Uma doença misteriosa está afetando seu povo. Muitos estão doentes e alguns já morreram.",
    choices: [
      {
        text: "Consultar os sacerdotes (custa 1 ouro)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.gold >= 1) {
            setResources((prev) => ({
              ...prev,
              gold: prev.gold - 1,
            }))

            const cured = Math.random() > 0.5
            if (cured) {
              addMessage("Os rituais dos sacerdotes funcionaram!")
              return "A doença foi contida graças aos rituais e ervas medicinais dos sacerdotes. -1 ouro."
            } else {
              setResources((prev) => ({
                ...prev,
                people: Math.max(1, prev.people - 3),
              }))
              addMessage("Os rituais dos sacerdotes falharam!")
              return "Os rituais falharam. A doença se espalhou. -1 ouro, -3 pessoas."
            }
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 2),
            }))
            addMessage("Sem ouro para os rituais, a doença se espalhou.")
            return "Sem ouro para os rituais, a doença se espalhou. -2 pessoas."
          }
        },
      },
      {
        text: "Isolar os doentes",
        effect: ({ resources, setResources, addMessage }) => {
          setResources((prev) => ({
            ...prev,
            people: Math.max(1, prev.people - 1),
          }))
          addMessage("O isolamento ajudou a conter a doença.")
          return "Isolamento reduziu o contágio, mas alguns não sobreviveram. -1 pessoa."
        },
      },
      {
        text: "Usar ervas medicinais (custa 2 grãos)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.grains >= 2) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains - 2,
            }))
            addMessage("As ervas medicinais ajudaram a curar os doentes.")
            return "As ervas medicinais ajudaram a curar os doentes. -2 grãos."
          } else {
            setResources((prev) => ({
              ...prev,
              people: Math.max(1, prev.people - 2),
            }))
            addMessage("Sem ervas suficientes, a doença se espalhou.")
            return "Sem ervas suficientes, a doença se espalhou. -2 pessoas."
          }
        },
      },
    ],
  },
  {
    id: "wheel",
    title: "Descoberta da Roda",
    description: "Seus inventores criaram um dispositivo circular que facilita o transporte e outras tarefas.",
    choices: [
      {
        text: "Produzir rodas em massa (custa 2 madeira)",
        effect: ({ resources, setResources, progress, setProgress, addAchievement, addMessage }) => {
          if (resources.wood >= 2) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 2,
            }))

            setProgress((prev) => prev + 15)
            addAchievement("Inventor da Roda")
            addMessage("A roda revoluciona seu transporte!")
            return "A roda acelera seu progresso! Carroças e ferramentas com rodas melhoram a eficiência. +15% progresso."
          } else {
            addMessage("Você não tem madeira suficiente para produzir rodas.")
            return "Você não tem madeira suficiente para produzir rodas em massa."
          }
        },
      },
      {
        text: "Usar a roda apenas para olaria (custa 1 madeira)",
        effect: ({ resources, setResources, progress, setProgress, addMessage }) => {
          if (resources.wood >= 1) {
            setResources((prev) => ({
              ...prev,
              wood: prev.wood - 1,
            }))

            setProgress((prev) => prev + 8)
            addMessage("A roda de oleiro melhora a produção de cerâmica.")
            return "A roda de oleiro melhora a produção de cerâmica. +8% progresso."
          } else {
            addMessage("Você não tem madeira suficiente nem para a roda de oleiro.")
            return "Você não tem madeira suficiente nem para a roda de oleiro."
          }
        },
      },
      {
        text: "Ignorar a invenção",
        effect: ({ addMessage }) => {
          addMessage("Você decidiu que a roda não é importante.")
          return "Você perdeu uma oportunidade de progresso tecnológico."
        },
      },
    ],
  },
  {
    id: "harvest_festival",
    title: "Festa da Colheita",
    description: "É tempo de celebrar as boas colheitas e agradecer aos deuses pela fertilidade da terra.",
    choices: [
      {
        text: "Realizar grande festa (custa 3 grãos)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.grains >= 3) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains - 3,
              people: prev.people + 2,
            }))
            addMessage("Seu povo está muito feliz com a festa!")
            return "Festa memorável! O povo está feliz e a população aumentou. -3 grãos, +2 pessoas."
          } else {
            addMessage("Não há grãos suficientes para a festa.")
            return "Não há grãos suficientes para a festa. O povo está desapontado."
          }
        },
      },
      {
        text: "Festa modesta (custa 1 grão)",
        effect: ({ resources, setResources, addMessage }) => {
          if (resources.grains >= 1) {
            setResources((prev) => ({
              ...prev,
              grains: prev.grains - 1,
              people: prev.people + 1,
            }))
            addMessage("A festa foi agradável.")
            return "Festa agradável. O povo está satisfeito. -1 grão, +1 pessoa."
          } else {
            addMessage("Sem grãos, não houve festa este ano.")
            return "Sem festa este ano. O povo está desapontado."
          }
        },
      },
      {
        text: "Fazer apenas rituais religiosos",
        effect: ({ progress, setProgress, addMessage }) => {
          setProgress((prev) => prev + 3)
          addMessage("Os rituais religiosos fortaleceram a fé do povo.")
          return "Os rituais religiosos fortaleceram a fé do povo. +3% progresso."
        },
      },
    ],
  },
  {
    id: "victory",
    title: "Vitória!",
    description: "Sua civilização alcançou grande desenvolvimento e se tornou uma potência do mundo antigo!",
    choices: [
      {
        text: "Jogar novamente",
        effect: () => {
          return "Parabéns pela sua vitória! Você pode jogar novamente e tentar uma civilização diferente."
        },
      },
    ],
    finalEvent: true,
  },
]

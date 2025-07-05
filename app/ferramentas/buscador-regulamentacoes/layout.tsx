import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscador de Regulamentações - Autopropelidos | Portal Autopropelidos',
  description: 'Encontre facilmente regulamentações do CONTRAN e outras normas relacionadas a equipamentos autopropelidos. Busque por resoluções, portarias e leis municipais.',
  keywords: 'regulamentações, CONTRAN, normas, patinete elétrico, bicicleta elétrica, legislação, autopropelidos, resolução 996, leis municipais, portarias'
}

export default function BuscadorRegulamentacoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
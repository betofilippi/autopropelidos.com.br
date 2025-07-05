import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guia de Documentação - Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Guia interativo passo a passo para documentação de equipamentos autopropelidos. Saiba quais documentos são necessários, onde obtê-los e quanto custa.',
  keywords: 'guia documentação, patinete elétrico documentos, bicicleta elétrica registro, autopropelidos documentação, nota fiscal, certificado conformidade'
}

export default function GuiaDocumentacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
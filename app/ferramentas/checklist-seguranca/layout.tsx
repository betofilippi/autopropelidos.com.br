import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checklist de Segurança para Autopropelidos | Portal Autopropelidos',
  description: 'Checklist completo de segurança para patinetes elétricos, bicicletas elétricas e outros autopropelidos. Inspeções pré-uso, manutenção e equipamentos de segurança.',
  keywords: 'checklist segurança, autopropelidos, patinete elétrico, bicicleta elétrica, manutenção, equipamentos segurança, inspeção',
  openGraph: {
    title: 'Checklist de Segurança - Portal Autopropelidos',
    description: 'Mantenha-se seguro com nosso checklist completo para equipamentos autopropelidos',
    type: 'website',
  }
}

export default function ChecklistSegurancaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
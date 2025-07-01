import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-blue-400">Blog Autopropelidos</h3>
            <p className="text-gray-300 text-sm">
              Seu portal completo sobre mobilidade urbana e equipamentos autopropelidos no Brasil.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-400">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categoria/legislacao" className="text-gray-300 hover:text-white transition-colors">
                  Legislação
                </Link>
              </li>
              <li>
                <Link href="/categoria/seguranca" className="text-gray-300 hover:text-white transition-colors">
                  Segurança
                </Link>
              </li>
              <li>
                <Link href="/categoria/tecnologia" className="text-gray-300 hover:text-white transition-colors">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/categoria/mercado" className="text-gray-300 hover:text-white transition-colors">
                  Mercado
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-400">Guias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guias/iniciante" className="text-gray-300 hover:text-white transition-colors">
                  Guia do Iniciante
                </Link>
              </li>
              <li>
                <Link href="/guias/seguranca" className="text-gray-300 hover:text-white transition-colors">
                  Segurança
                </Link>
              </li>
              <li>
                <Link href="/guias/manutencao" className="text-gray-300 hover:text-white transition-colors">
                  Manutenção
                </Link>
              </li>
              <li>
                <Link href="/guias/financeiro" className="text-gray-300 hover:text-white transition-colors">
                  Financeiro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-400">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/anuncie" className="text-gray-300 hover:text-white transition-colors">
                  Anuncie Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Blog Autopropelidos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

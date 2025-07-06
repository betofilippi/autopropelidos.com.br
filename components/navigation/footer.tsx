import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const footerLinks = {
  platform: {
    title: "Plataforma",
    links: [
      { label: "Início", href: "/" },
      { label: "Resolução 996", href: "/resolucao-996" },
      { label: "Notícias", href: "/noticias" },
      { label: "Vídeos", href: "/videos" },
      { label: "Sobre", href: "/sobre" },
    ]
  },
  tools: {
    title: "Ferramentas",
    links: [
      { label: "Verificador de Conformidade", href: "/ferramentas/verificador-conformidade" },
      { label: "Calculadora de Custos", href: "/ferramentas/calculadora-custos" },
      { label: "Buscador de Regulamentações", href: "/ferramentas/buscador-regulamentacoes" },
      { label: "Guia de Documentação", href: "/ferramentas/guia-documentacao" },
      { label: "Planejador de Rotas", href: "/ferramentas/planejador-rotas" },
      { label: "Checklist de Segurança", href: "/ferramentas/checklist-seguranca" },
    ]
  },
  resources: {
    title: "Recursos",
    links: [
      { label: "Biblioteca", href: "/biblioteca" },
      { label: "FAQ", href: "/faq" },
      { label: "Glossário", href: "/glossario" },
      { label: "Central de Ajuda", href: "/ajuda" },
      { label: "Contato", href: "/contato" },
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Aviso Legal", href: "/aviso-legal" },
    ]
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      {/* Newsletter Section */}
      <section className="border-b border-gray-800" aria-labelledby="newsletter-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 id="newsletter-heading" className="text-2xl font-bold text-white mb-4">
              Mantenha-se Informado
            </h3>
            <p className="text-gray-400 mb-8">
              Receba as últimas notícias e atualizações sobre equipamentos autopropelidos e regulamentações
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              aria-label="Formulário de inscrição na newsletter"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Endereço de e-mail
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Seu e-mail"
                required
                aria-describedby="newsletter-description"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-describedby="newsletter-description"
              >
                Inscrever-se
              </button>
              <p id="newsletter-description" className="sr-only">
                Inscreva-se para receber notícias e atualizações sobre equipamentos autopropelidos
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">AutoPropelidos</h2>
              <p className="text-sm text-gray-400 mt-1">Portal de Informação</p>
            </div>
            <p className="text-gray-400 mb-6">
              O portal definitivo sobre a Resolução 996 do CONTRAN e equipamentos autopropelidos. 
              Informação confiável para você circular com segurança e dentro da lei.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
                aria-label="Facebook - Seguir AutoPropelidos"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
                aria-label="Instagram - Seguir AutoPropelidos"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
                aria-label="YouTube - Canal AutoPropelidos"
              >
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
                aria-label="Twitter - Seguir AutoPropelidos"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <nav aria-labelledby="footer-platform-heading">
            <h3 id="footer-platform-heading" className="text-white font-semibold mb-4">{footerLinks.platform.title}</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.platform.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-tools-heading">
            <h3 id="footer-tools-heading" className="text-white font-semibold mb-4">{footerLinks.tools.title}</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.tools.links.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-resources-heading">
            <h3 id="footer-resources-heading" className="text-white font-semibold mb-4">{footerLinks.resources.title}</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.resources.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact Info */}
        <section className="mt-12 pt-8 border-t border-gray-800" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="sr-only">Informações de Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <a 
                href="mailto:contato@autopropelidos.com.br" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                aria-label="Enviar email para contato@autopropelidos.com.br"
              >
                contato@autopropelidos.com.br
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <a 
                href="tel:+5508001234567" 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                aria-label="Ligar para 0800 123 4567"
              >
                0800 123 4567
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <span className="text-gray-400">São Paulo, SP - Brasil</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 AutoPropelidos. Todos os direitos reservados.
            </div>
            <nav aria-label="Links legais" className="flex space-x-6 text-sm">
              {footerLinks.legal.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>
    </footer>
  )
}
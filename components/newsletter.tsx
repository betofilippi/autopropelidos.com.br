import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Bell, Zap } from "lucide-react"

export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Fique Sempre Atualizado</CardTitle>
          <p className="text-blue-100">Receba as últimas notícias sobre legislação, tecnologia e dicas de segurança</p>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2 mb-6">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-blue-600 hover:bg-white/90">Assinar</Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Alertas legislativos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Novidades do setor</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default Newsletter

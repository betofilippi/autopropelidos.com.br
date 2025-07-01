"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const interestOptions = [
    { id: 'regulations', label: 'Atualizações sobre regulamentações' },
    { id: 'safety', label: 'Dicas de segurança' },
    { id: 'technology', label: 'Novidades tecnológicas' },
    { id: 'market', label: 'Análises de mercado' },
    { id: 'reviews', label: 'Reviews de equipamentos' }
  ]

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interestId])
    } else {
      setInterests(interests.filter(id => id !== interestId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically send the data to your backend
    console.log('Newsletter subscription:', { email, interests })
    
    setIsSubscribed(true)
    setIsLoading(false)
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Card className="text-center bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Inscrição Confirmada!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Obrigado por se inscrever! Você receberá nossas atualizações sobre autopropelidos 
                  e Resolução 996 diretamente em seu email.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                Fique Sempre Atualizado
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Receba as últimas notícias, atualizações de legislação e dicas importantes 
                sobre equipamentos autopropelidos diretamente em seu email.
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Que tipo de conteúdo você gostaria de receber?
                  </Label>
                  <div className="mt-3 space-y-3">
                    {interestOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={interests.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleInterestChange(option.id, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={option.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscrevendo...' : 'Inscrever-se na Newsletter'}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Não enviamos spam. Você pode cancelar sua inscrição a qualquer momento. 
                  Ao se inscrever, você concorda com nossa política de privacidade.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
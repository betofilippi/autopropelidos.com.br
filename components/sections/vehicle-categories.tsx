import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, Car } from "lucide-react"
import Link from "next/link"

const vehicleCategories = [
  {
    id: "bicicleta-eletrica",
    title: "Bicicleta Elétrica",
    icon: <Zap className="h-6 w-6" />,
    description: "Assistência ao pedalar, sem acelerador manual",
    specs: {
      power: "Até 1000W",
      speed: "Até 32 km/h",
      assist: "Apenas com pedal",
      registration: "Não necessário"
    },
    color: "green",
    image: "/images/bike-eletrica.jpg",
    examples: [
      "Trek Verve+ 2",
      "Specialized Turbo Vado",
      "Giant Quick-E+",
      "Caloi E-Vibe Easy"
    ],
    requirements: [
      "Velocímetro ou limitador eletrônico",
      "Campainha",
      "Sinalização noturna (dianteira, traseira e lateral)",
      "Espelho retrovisor esquerdo",
      "Pneus em bom estado"
    ]
  },
  {
    id: "autopropelido",
    title: "Autopropelido",
    icon: <Users className="h-6 w-6" />,
    description: "Patinetes, hoverboards e similares",
    specs: {
      power: "Até 1000W",
      speed: "Até 32 km/h", 
      width: "Até 70cm",
      wheelbase: "Até 130cm"
    },
    color: "blue",
    image: "/images/patinete-eletrico.jpg",
    examples: [
      "Xiaomi Mi Scooter",
      "Segway Ninebot",
      "Multilaser Move",
      "Foston S08"
    ],
    requirements: [
      "Velocímetro e/ou limitador eletrônico",
      "Sinalização noturna incorporada",
      "Sistema de autoequilíbrio (quando aplicável)"
    ]
  },
  {
    id: "ciclomotor",
    title: "Ciclomotor",
    icon: <Car className="h-6 w-6" />,
    description: "Scooters e motos elétricas pequenas",
    specs: {
      power: "Até 4000W",
      speed: "Até 50 km/h",
      license: "CNH Cat. A ou ACC",
      registration: "Obrigatório"
    },
    color: "orange",
    image: "/images/ciclomotor.jpg",
    examples: [
      "Honda PCX 150",
      "Yamaha Neo 125",
      "Suzuki Burgman 125",
      "Voltz EV1"
    ],
    requirements: [
      "Registro no DETRAN",
      "Emplacamento obrigatório",
      "Carteira de habilitação",
      "Equipamentos obrigatórios do CTB"
    ]
  }
]

export default function VehicleCategories() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Categorias de Veículos
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Entenda as diferenças e saiba em qual categoria seu veículo se encaixa
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {vehicleCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                {/* Placeholder para imagem - substitua pelas imagens reais */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`rounded-full p-4 ${
                    category.color === 'green' ? 'bg-green-100 text-green-600' :
                    category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {category.icon}
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <Badge variant={
                    category.color === 'green' ? 'default' :
                    category.color === 'blue' ? 'secondary' :
                    'destructive'
                  }>
                    {category.specs.registration || 'Sem Registro'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Especificações */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(category.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">
                        {key === 'power' ? 'Potência' :
                         key === 'speed' ? 'Velocidade' :
                         key === 'width' ? 'Largura' :
                         key === 'wheelbase' ? 'Entre-eixos' :
                         key === 'assist' ? 'Assistência' :
                         key === 'license' ? 'Habilitação' :
                         key === 'registration' ? 'Registro' : key}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Exemplos */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Exemplos:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {category.examples.slice(0, 2).join(', ')}
                    {category.examples.length > 2 && '...'}
                  </div>
                </div>

                {/* Botão para mais detalhes */}
                <Link href={`/categorias/${category.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Detalhes e Requisitos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/verificador">
            <Button size="lg" className="gap-2">
              <Zap className="h-5 w-5" />
              Verificar Meu Veículo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
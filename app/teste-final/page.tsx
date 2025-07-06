import { Card, CardContent } from "@/components/ui/card"

export default function TesteFinal() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>TESTE FINAL - COMPONENTES CORRIGIDOS</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>1. Teste do padrão que funcionou:</h2>
        <div className="h-72 w-full" style={{ maxWidth: '400px' }}>
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
            alt="Teste funcionando"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>2. Teste com Card (como nos componentes):</h2>
        <Card className="overflow-hidden" style={{ maxWidth: '400px' }}>
          <div className="h-48 w-full">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
              alt="Teste Card"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3>Título da notícia</h3>
            <p>Descrição da notícia...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
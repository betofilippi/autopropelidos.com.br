export default function TesteImagem() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Teste de Imagens Simples</h1>
      
      <div className="space-y-4">
        <div>
          <h2>1. Imagem direta do Unsplash:</h2>
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
            alt="Bicicleta elétrica"
            width="400"
            height="300"
          />
        </div>

        <div>
          <h2>2. Imagem de placeholder simples:</h2>
          <img 
            src="https://picsum.photos/400/300" 
            alt="Placeholder"
            width="400"
            height="300"
          />
        </div>

        <div>
          <h2>3. Imagem local (caso tenha):</h2>
          <img 
            src="/favicon.ico" 
            alt="Favicon local"
            width="32"
            height="32"
          />
        </div>
      </div>
    </div>
  )
}
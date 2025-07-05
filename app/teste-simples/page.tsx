export default function TesteSimples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>TESTE MÁXIMO SIMPLES</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>1. Imagem que funcionou:</h2>
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
          alt="Teste"
          style={{ border: '2px solid red' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>2. Mesma imagem em componente Card:</h2>
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
            alt="Teste Card"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div>
        <h2>3. Com classes Tailwind:</h2>
        <div className="border p-4">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300" 
            alt="Teste Tailwind"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}
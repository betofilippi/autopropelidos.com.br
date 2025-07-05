'use client'

export default function RawTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Raw Image Test - No External Dependencies</h1>
      <p>Este é um teste básico para verificar se as imagens carregam.</p>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Teste 1: placeholder.svg</h2>
        <img
          src="/placeholder.svg"
          alt="Placeholder SVG"
          style={{ 
            width: '200px', 
            height: '150px', 
            border: '2px solid blue',
            display: 'block'
          }}
          onLoad={() => {
            console.log('✅ placeholder.svg carregou com sucesso!')
            alert('✅ placeholder.svg carregou!')
          }}
          onError={(e) => {
            console.error('❌ Erro ao carregar placeholder.svg:', e)
            alert('❌ Erro ao carregar placeholder.svg')
          }}
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Teste 2: Imagem externa</h2>
        <img
          src="https://via.placeholder.com/200x150/00FF00/FFFFFF?text=EXTERNA"
          alt="Imagem externa"
          style={{ 
            width: '200px', 
            height: '150px', 
            border: '2px solid green',
            display: 'block'
          }}
          onLoad={() => {
            console.log('✅ Imagem externa carregou!')
            alert('✅ Imagem externa carregou!')
          }}
          onError={(e) => {
            console.error('❌ Erro na imagem externa:', e)
            alert('❌ Erro na imagem externa')
          }}
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Status</h2>
        <p>Página carregada. Verifique se as imagens aparecem acima.</p>
        <p>Se as imagens carregarem, você verá alertas popup.</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Testes Manuais</h2>
        <button 
          onClick={() => window.open('/placeholder.svg', '_blank')}
          style={{ 
            padding: '10px', 
            margin: '5px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Abrir placeholder.svg diretamente
        </button>
        
        <button 
          onClick={() => {
            fetch('/placeholder.svg')
              .then(response => {
                console.log('Fetch result:', response.status, response.ok)
                alert(`Fetch resultado: ${response.status} - ${response.ok ? 'OK' : 'Erro'}`)
                return response.text()
              })
              .then(text => {
                console.log('SVG content length:', text.length)
                alert(`Conteúdo SVG: ${text.length} caracteres`)
              })
              .catch(error => {
                console.error('Fetch error:', error)
                alert('Erro no fetch: ' + error.message)
              })
          }}
          style={{ 
            padding: '10px', 
            margin: '5px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Testar fetch() do SVG
        </button>
      </div>
    </div>
  )
}
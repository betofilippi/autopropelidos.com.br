'use client'

import { useEffect } from 'react'

export default function IsolatedTestPage() {
  useEffect(() => {
    console.log('🔍 Página React carregada')
    
    // Test if images can be loaded via JavaScript
    const testImg = new Image()
    testImg.onload = () => {
      console.log('✅ SVG carregou via JavaScript')
      alert('✅ SVG carregou via JavaScript!')
    }
    testImg.onerror = (e) => {
      console.error('❌ Erro ao carregar SVG:', e)
      alert('❌ Erro ao carregar SVG via JavaScript')
    }
    testImg.src = '/placeholder.svg'
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 TESTE ISOLADO REACT</h1>
      <p>Esta é uma página React com CSS inline para evitar conflitos.</p>
      
      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        border: '3px solid black',
        backgroundColor: 'lightgray'
      }}>
        <h2>Teste 1: SVG Local</h2>
        <img 
          src="/placeholder.svg"
          alt="Test SVG"
          style={{
            width: '200px',
            height: '150px',
            border: '5px solid red',
            backgroundColor: 'yellow',
            display: 'block'
          }}
          onLoad={() => {
            console.log('✅ SVG carregou via onLoad React')
            alert('✅ SVG carregou via onLoad React!')
          }}
          onError={(e) => {
            console.error('❌ Erro onError React:', e)
            alert('❌ Erro onError React')
          }}
        />
        <p style={{ marginTop: '10px' }}>
          ↑ Você deve ver um retângulo amarelo com borda vermelha contendo uma imagem SVG cinza.
        </p>
      </div>

      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        border: '3px solid blue',
        backgroundColor: 'lightblue'
      }}>
        <h2>Teste 2: Imagem Externa</h2>
        <img 
          src="https://via.placeholder.com/200x150/00FF00/000000?text=FUNCIONOU"
          alt="External test"
          style={{
            width: '200px',
            height: '150px',
            border: '5px solid green',
            backgroundColor: 'pink',
            display: 'block'
          }}
          onLoad={() => {
            console.log('✅ Imagem externa carregou')
            alert('✅ Imagem externa carregou!')
          }}
          onError={(e) => {
            console.error('❌ Erro imagem externa:', e)
            alert('❌ Erro imagem externa')
          }}
        />
        <p style={{ marginTop: '10px' }}>
          ↑ Você deve ver um retângulo rosa com borda verde contendo uma imagem verde com texto "FUNCIONOU".
        </p>
      </div>

      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        border: '3px solid purple',
        backgroundColor: 'lavender'
      }}>
        <h2>Instruções para o usuário:</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>✅ Se você vê alertas popup, as imagens estão sendo carregadas pelo JavaScript</li>
          <li>👁️ Se você vê as imagens VISUALMENTE nas caixas coloridas, então tudo está funcionando</li>
          <li>❌ Se você vê apenas as caixas coloridas vazias, há um problema de renderização</li>
          <li>🌐 Teste também: <a href="/test-simple.html" target="_blank">Página HTML Estática</a></li>
        </ul>
      </div>
    </div>
  )
}
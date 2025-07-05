export default function MinimalTestPage() {
  return (
    <html>
      <head>
        <title>Minimal Image Test</title>
      </head>
      <body style={{ margin: 0, padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Minimal Image Test - Bypass Layout</h1>
        <p>Esta página bypassa completamente o layout principal.</p>
        
        <div style={{ margin: '20px 0', padding: '10px', border: '2px solid black' }}>
          <h2>Teste: placeholder.svg</h2>
          <img 
            src="/placeholder.svg" 
            alt="Test SVG"
            style={{
              width: '200px',
              height: '150px',
              border: '3px solid red',
              display: 'block',
              backgroundColor: 'yellow'
            }}
          />
        </div>

        <div style={{ margin: '20px 0', padding: '10px', border: '2px solid black' }}>
          <h2>Teste: Imagem externa</h2>
          <img 
            src="https://via.placeholder.com/200x150/00FF00/FFFFFF?text=TESTE"
            alt="External test"
            style={{
              width: '200px',
              height: '150px',
              border: '3px solid blue',
              display: 'block',
              backgroundColor: 'pink'
            }}
          />
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          console.log('Página carregada');
          
          // Test direct image loading
          const img1 = new Image();
          img1.onload = () => {
            console.log('✅ placeholder.svg carregou via JavaScript!');
            alert('✅ SVG carregou via JavaScript!');
          };
          img1.onerror = (e) => {
            console.error('❌ Erro no JavaScript:', e);
            alert('❌ Erro no JavaScript');
          };
          img1.src = '/placeholder.svg';
        `}} />
      </body>
    </html>
  )
}
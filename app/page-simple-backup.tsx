const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem',
  margin: '1rem 0'
}

const btnStyle = {
  display: 'inline-block',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500'
}

const btnSecondaryStyle = {
  ...btnStyle,
  backgroundColor: '#6b7280'
}

export default function HomePage() {
  return (
    <div style={{ padding: '3rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem' }}>
            Bem-vindo ao Portal Autopropelidos
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
            O portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. 
            Encontre informações, notícias, vídeos e ferramentas para entender a regulamentação 
            de patinetes elétricos, bicicletas elétricas e outros equipamentos de mobilidade urbana.
          </p>
        </section>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>O que são Equipamentos Autopropelidos?</h2>
          <p style={{ lineHeight: '1.6', color: '#555' }}>
            A Resolução 996/2023 do CONTRAN define como "autopropelidos" os equipamentos de mobilidade 
            individual que possuem motor elétrico com potência máxima de 1.000W e velocidade máxima de 32 km/h.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Principais Ferramentas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Verificador de Conformidade</h3>
              <p style={{ marginBottom: '1rem', color: '#555' }}>Verifique se seu equipamento está conforme a Resolução 996.</p>
              <a href="/ferramentas/verificador-conformidade" style={btnStyle}>Verificar</a>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Calculadora de Custos</h3>
              <p style={{ marginBottom: '1rem', color: '#555' }}>Calcule os custos de uso do seu equipamento autopropelido.</p>
              <a href="/ferramentas/calculadora-custos" style={btnStyle}>Calcular</a>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Buscador de Regulamentações</h3>
              <p style={{ marginBottom: '1rem', color: '#555' }}>Encontre regulamentações específicas da sua cidade.</p>
              <a href="/ferramentas/buscador-regulamentacoes" style={btnStyle}>Buscar</a>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Seções do Portal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <a href="/resolucao-996" style={btnSecondaryStyle}>Resolução 996</a>
            <a href="/noticias" style={btnSecondaryStyle}>Notícias</a>
            <a href="/videos" style={btnSecondaryStyle}>Vídeos</a>
            <a href="/faq" style={btnSecondaryStyle}>FAQ</a>
            <a href="/glossario" style={btnSecondaryStyle}>Glossário</a>
            <a href="/biblioteca" style={btnSecondaryStyle}>Biblioteca</a>
          </div>
        </div>
      </div>
    </div>
  )
}
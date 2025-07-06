import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

export default async function TesteDados() {
  const [latestNews, featuredVideos] = await Promise.all([
    getLatestNews(undefined, 3),
    getLatestVideos(undefined, 3)
  ])

  return (
    <div style={{ padding: '20px' }}>
      <h1>TESTE DE DADOS DAS APIS</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>1. Dados das Notícias:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
          {JSON.stringify(latestNews, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>2. Dados dos Vídeos:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
          {JSON.stringify(featuredVideos, null, 2)}
        </pre>
      </div>

      <div>
        <h2>3. Teste de URLs específicas:</h2>
        {latestNews.map((item, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <p><strong>Notícia {i+1}:</strong> {item.title}</p>
            <p><strong>URL da imagem:</strong> {item.image_url || 'VAZIA'}</p>
            {item.image_url && (
              <img src={item.image_url} alt="teste" style={{ width: '200px', height: '100px', border: '1px solid red' }} />
            )}
          </div>
        ))}
        
        {featuredVideos.map((video, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <p><strong>Vídeo {i+1}:</strong> {video.title}</p>
            <p><strong>URL thumbnail:</strong> {video.thumbnail_url || 'VAZIA'}</p>
            {video.thumbnail_url && (
              <img src={video.thumbnail_url} alt="teste" style={{ width: '200px', height: '100px', border: '1px solid blue' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
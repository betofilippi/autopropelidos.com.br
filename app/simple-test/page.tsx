'use client'

export default function SimpleTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Simple Image Test (No Tailwind CSS)</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test 1: Regular HTML img tag</h2>
        <img
          src="/placeholder.svg"
          alt="Test image"
          style={{ 
            width: '200px', 
            height: '150px', 
            border: '2px solid blue',
            display: 'block'
          }}
          onLoad={() => console.log('Image loaded successfully!')}
          onError={(e) => console.error('Image failed to load:', e)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test 2: External image</h2>
        <img
          src="https://via.placeholder.com/200x150/FF0000/FFFFFF?text=External"
          alt="External test image"
          style={{ 
            width: '200px', 
            height: '150px', 
            border: '2px solid green',
            display: 'block'
          }}
          onLoad={() => console.log('External image loaded!')}
          onError={(e) => console.error('External image failed:', e)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test 3: CSS Background Image</h2>
        <div
          style={{
            width: '200px',
            height: '150px',
            border: '2px solid red',
            backgroundImage: 'url(/placeholder.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <span style={{ color: 'white', padding: '10px' }}>CSS Background</span>
        </div>
      </div>

      <div>
        <h2>Browser Information</h2>
        <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
        <p>Image support: {typeof Image !== 'undefined' ? 'Available' : 'Not available'}</p>
      </div>
    </div>
  )
}
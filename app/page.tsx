'use client';

import { useState } from 'react';

export default function Home() {
  const [color, setColor] = useState('coral pink');
  const [style, setStyle] = useState('elegant minimalist');
  const [background, setBackground] = useState('soft marble luxury');
  const [variations, setVariations] = useState('4');
  const [badgeColor, setBadgeColor] = useState('#E91E63');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colorPresets = [
    'coral pink', 'ruby red', 'deep burgundy', 'soft rose', 'nude beige',
    'lavender purple', 'mint green', 'navy blue', 'champagne gold', 'classic black'
  ];

  const stylePresets = [
    'elegant minimalist', 'haute couture', 'editorial luxury', 'soft romantic',
    'bold modern', 'vintage glamour', 'contemporary chic', 'natural beauty'
  ];

  const backgroundPresets = [
    'soft marble luxury', 'silk fabric draping', 'venetian plaster wall',
    'gold leaf accent', 'minimalist white studio', 'velvet texture',
    'sunset gradient', 'botanical elegance', 'architectural modern'
  ];

  const generateImages = async () => {
    setLoading(true);
    setError('');
    setImages([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color, style, background, variations }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();
      setImages(data.images);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      // Create canvas to add badge
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw badge circle
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.beginPath();
      ctx.arc(850, 850, 120, 0, Math.PI * 2);
      ctx.fillStyle = badgeColor;
      ctx.fill();
      ctx.restore();

      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText('TPO FREE', 850, 830);
      ctx.fillText('•', 850, 850);
      ctx.fillText('HEMA FREE', 850, 870);

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aloha-nails-${color.replace(/\s+/g, '-')}-${index + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffe5f0 50%, #ffd6e8 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #e91e63 0%, #ff1744 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Aloha Nails AI Photoshoot Pro
          </h1>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Ultra-realistic high-fashion nail photography for alohanails.gr
          </p>
        </div>

        {/* Control Panel */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 10px 40px rgba(233, 30, 99, 0.15)'
        }}>
          {/* Nail Color */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '10px',
              color: '#333',
              fontSize: '16px'
            }}>
              Nail Polish Color
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {colorPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: color === c ? '2px solid #e91e63' : '2px solid #e0e0e0',
                    background: color === c ? '#fce4ec' : 'white',
                    color: color === c ? '#e91e63' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Or enter custom color..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Style */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '10px',
              color: '#333',
              fontSize: '16px'
            }}>
              Photography Style
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {stylePresets.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: style === s ? '2px solid #e91e63' : '2px solid #e0e0e0',
                    background: style === s ? '#fce4ec' : 'white',
                    color: style === s ? '#e91e63' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Or enter custom style..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Background */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '10px',
              color: '#333',
              fontSize: '16px'
            }}>
              Background Setting
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {backgroundPresets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBackground(b)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: background === b ? '2px solid #e91e63' : '2px solid #e0e0e0',
                    background: background === b ? '#fce4ec' : 'white',
                    color: background === b ? '#e91e63' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Or enter custom background..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Variations & Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#333',
                fontSize: '16px'
              }}>
                Number of Variations
              </label>
              <select
                value={variations}
                onChange={(e) => setVariations(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value="1">1 image</option>
                <option value="2">2 images</option>
                <option value="3">3 images</option>
                <option value="4">4 images</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#333',
                fontSize: '16px'
              }}>
                Badge Color
              </label>
              <input
                type="color"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateImages}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #e91e63 0%, #ff1744 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(233, 30, 99, 0.4)'
            }}
          >
            {loading ? 'Generating Magic...' : 'Generate Photoshoot'}
          </button>

          {error && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: '#ffebee',
              color: '#c62828',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Your Aloha Nails Collection
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`Aloha Nails ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                    {/* Badge Preview */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: badgeColor,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>
                      <div>TPO FREE</div>
                      <div style={{ margin: '2px 0' }}>•</div>
                      <div>HEMA FREE</div>
                    </div>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <button
                      onClick={() => downloadImage(img, idx)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #e91e63 0%, #ff1744 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Download with Badge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>Created for <strong>alohanails.gr</strong></p>
          <p style={{ marginTop: '10px' }}>Ultra-realistic AI photoshoots for luxury nail polish</p>
        </div>
      </div>
    </div>
  );
}

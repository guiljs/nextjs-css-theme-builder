'use client';

import React, { useState, useEffect } from 'react';
import { ChromePicker, SketchPicker } from 'react-color';
import { FiSun, FiMoon, FiDroplet, FiEye, FiGrid, FiSliders } from 'react-icons/fi';

export default function ThemeBuilder() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [darkMode, setDarkMode] = useState(false);
  // eslint-disable-next-line no-extra-parens
  const [exportFormat, setExportFormat] = useState<'css' | 'sass'>('css');

  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Function to generate tints (lighter versions)
  const generateTint = (hex: string, amount: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const newR = Math.min(255, Math.round(r + (255 - r) * amount));
    const newG = Math.min(255, Math.round(g + (255 - g) * amount));
    const newB = Math.min(255, Math.round(b + (255 - b) * amount));

    return rgbToHex(newR, newG, newB);
  };

  // Function to generate shades (darker versions)
  const generateShade = (hex: string, amount: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const newR = Math.max(0, Math.round(r * (1 - amount)));
    const newG = Math.max(0, Math.round(g * (1 - amount)));
    const newB = Math.max(0, Math.round(b * (1 - amount)));

    return rgbToHex(newR, newG, newB);
  };

  // Generate color palette
  const generatePalette = () => {
    const palette: { [key: string]: string } = {
      '50': generateTint(baseColor, 0.95),
      '100': generateTint(baseColor, 0.9),
      '200': generateTint(baseColor, 0.7),
      '300': generateTint(baseColor, 0.5),
      '400': generateTint(baseColor, 0.25),
      '500': baseColor,
      '600': generateShade(baseColor, 0.1),
      '700': generateShade(baseColor, 0.3),
      '800': generateShade(baseColor, 0.5),
      '900': generateShade(baseColor, 0.7),
      '950': generateShade(baseColor, 0.9)
    };
    return palette;
  };

  const palette = generatePalette();

  // Neumorphic styles based on dark mode
  const neumorphicStyle = (raised = true) => ({
    background: darkMode ? '#1a1a1a' : '#f0f0f0',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: raised
      ? darkMode
        ? '8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a'
        : '8px 8px 16px #d0d0d0, -8px -8px 16px #ffffff'
      : darkMode
        ? 'inset 8px 8px 16px #0a0a0a, inset -8px -8px 16px #2a2a2a'
        : 'inset 8px 8px 16px #d0d0d0, inset -8px -8px 16px #ffffff'
  });

  const containerStyle = {
    minHeight: '100vh',
    background: darkMode ? '#1a1a1a' : '#f0f0f0',
    color: darkMode ? '#ffffff' : '#333333',
    transition: 'all 0.3s ease',
    padding: '20px',
    fontFamily: 'Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
  };

  // Export function
  const exportTheme = () => {
    let output = '';

    if (exportFormat === 'css') {
      output = ':root {\n';
      Object.entries(palette).forEach(([key, value]) => {
        output += `  --color-primary-${key}: ${value};\n`;
      });
      output += `  --color-base: ${baseColor};\n`;
      output += '}';
    } else {
      Object.entries(palette).forEach(([key, value]) => {
        output += `$color-primary-${key}: ${value};\n`;
      });
      output += `$color-base: ${baseColor};\n`;
    }

    // Create blob and download
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme.${exportFormat === 'css' ? 'css' : 'scss'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        textAlign: 'left',
        display: 'flex', // Adiciona flexbox
        justifyContent: 'space-between', // Espaço entre os elementos
        alignItems: 'center' // Alinha verticalmente
      }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>CSS Theme Builder</h1>
          <p style={{ opacity: 0.7 }}>Create beautiful color palettes for your projects</p>
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ marginBottom: '0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{
              ...neumorphicStyle(!darkMode),
              width: '60px',
              height: '30px',
              borderRadius: '15px',
              position: 'relative',
              padding: '3px',
              cursor: 'pointer'
            }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: darkMode ? '#6366f1' : '#cccccc',
                position: 'absolute',
                top: '3px',
                left: darkMode ? '33px' : '3px',
                transition: 'all 0.3s ease'
              }}
              />
            </div>
            <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{ display: 'none' }}
            />
            {/* Label for Dark Mode */}
            {
              darkMode ? <FiMoon /> : <FiSun />
            }

          </label>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 4fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}
      >

        {/* Left Panel - Color Picker */}
        <div style={neumorphicStyle()}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
            <FiDroplet /> Choose Color
          </h2>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Base color</h3>
            <div style={{
              ...neumorphicStyle(false),
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
            >

              <SketchPicker
                  disableAlpha
                  color={baseColor}
                  onChange={(color) => setBaseColor(color.hex)}
              />

            </div>
          </div>


          {/* Export Options */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>Export Format</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                  onClick={() => setExportFormat('css')}
                  style={{
                  ...neumorphicStyle(exportFormat === 'css'),
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  color: darkMode ? '#ffffff' : '#333333',
                  flex: 1
                }}
              >
                CSS
              </button>
              <button
                  onClick={() => setExportFormat('sass')}
                  style={{
                  ...neumorphicStyle(exportFormat === 'sass'),
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  color: darkMode ? '#ffffff' : '#333333',
                  flex: 1
                }}
              >
                SASS
              </button>
            </div>
            <button
                onClick={exportTheme}
                style={{
                ...neumorphicStyle(),
                border: 'none',
                padding: '15px',
                width: '100%',
                cursor: 'pointer',
                color: darkMode ? '#ffffff' : '#333333',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Export Theme
            </button>
          </div>
        </div>

        {/* Center Panel - Tints and Shades */}
        <div style={{ ...neumorphicStyle() }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}><FiGrid /> Palette</h2>

          {/* Tints Section */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Tints</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.entries(palette)
                .filter(([key]) => parseInt(key) < 500) // Filtra apenas os tints
                .map(([key, color]) =>
                  <div
                      key={key}
                      style={{
                      height: '60px',
                      backgroundColor: color,
                      borderRadius: '10px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      padding: '10px',
                      color: parseInt(key) > 500 ? 'white' : palette['900']
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {key === '500' ? 'Base' : key}
                    </div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{color}</div>
                  </div>
                )}
            </div>
          </div>

          {/* Shades Section */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>Shades</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.entries(palette)
                .filter(([key]) => parseInt(key) >= 500) // Filtra apenas os shades
                .map(([key, color]) =>
                  <div
                      key={key}
                      style={{
                      height: '60px',
                      backgroundColor: color,
                      borderRadius: '10px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      padding: '10px',
                      color: parseInt(key) > 500 ? 'white' : palette['900']
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {key === '500' ? 'Base' : key}
                    </div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>{color}</div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div style={neumorphicStyle()}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
            <FiEye /> Live Preview</h2>

          {/* Button Examples */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Buttons</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                background: palette['500'],
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              >
                Primary
              </button>
              <button style={{
                background: palette['200'],
                color: palette['900'],
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              >
                Secondary
              </button>
              <button style={{
                background: 'transparent',
                color: palette['600'],
                border: `2px solid ${palette['500']}`,
                padding: '10px 22px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              >
                Outlined
              </button>
            </div>
          </div>

          {/* Alert Examples */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Alerts</h3>
            <div style={{
              background: palette['100'],
              border: `1px solid ${palette['300']}`,
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px'
            }}
            >
              <strong style={{ color: palette['800'] }}>Info:</strong>
              <span style={{ color: palette['700'], marginLeft: '10px' }}>
                This is an informational alert
              </span>
            </div>
          </div>

          {/* Card Example */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Card</h3>
            <div style={{
              ...neumorphicStyle(),
              padding: '20px'
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                background: palette['500'],
                borderRadius: '10px',
                marginBottom: '15px'
              }}
              />
              <h4 style={{ marginBottom: '10px', color: palette['800'] }}>Card Title</h4>
              <p style={{ opacity: 0.7, margin: 0 }}>
                This is a card component using your theme colors.
              </p>
            </div>
          </div>

          {/* Badge Examples */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>Badges</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['100', '300', '500', '700', '900'].map((shade) =>
                <span
                    key={shade}
                    style={{
                    background: palette[shade],
                    color: parseInt(shade) > 500 ? 'white' : palette['900'],
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}
                >
                  Badge {shade}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
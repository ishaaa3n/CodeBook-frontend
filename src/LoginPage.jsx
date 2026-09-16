import React, { useEffect, useState } from 'react';
import CodeBookLogo from './CodeBookLogo';
import { BACKEND_URL } from './api';

const CB = {
  bg:          '#13151a',
  surface:     '#1a1c22',
  surface2:    '#1e2128',
  surface3:    '#252830',
  border:      'rgba(255,255,255,0.07)',
  border2:     'rgba(255,255,255,0.12)',
  blue:        '#1a9be6',
  blueDim:     'rgba(26,155,230,0.12)',
  blueBorder:  'rgba(26,155,230,0.3)',
  textPrimary: 'rgba(220,228,240,0.95)',
  textSecond:  'rgba(180,195,215,0.75)',
  textMuted:   'rgba(120,135,155,0.7)',
};

const LoginPage = () => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const fullText = 'Iterate fast.';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <div style={{ height: '100vh', background: CB.bg, display: 'flex', overflow: 'hidden' }}>
      <style>{`
        .google-btn:hover {
          background: ${CB.surface3} !important;
          border-color: rgba(255,255,255,0.18) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }
        .google-btn:active { transform: translateY(0px) !important; }
        .google-btn { transition: all 0.15s ease; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor { animation: blink 1s step-end infinite; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{
        width: '55%', height: '100%', padding: '40px 64px',
        display: 'flex', flexDirection: 'column',
        borderRight: `1px solid ${CB.border}`,
        background: `radial-gradient(ellipse at 10% 10%, ${CB.surface} 0%, ${CB.bg} 60%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(26,155,230,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CodeBookLogo size={36} />
        </div>

        {/* Headline */}
        <div style={{ marginTop: '48px', position: 'relative', minHeight: '150px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '42px', fontWeight: '600', color: CB.textPrimary, lineHeight: 1.1, letterSpacing: '-2px' }}>
            Write code.<br />Run it.<br />
            <span style={{ color: CB.textMuted }}>
              {displayed}
              {!done && <span className="cursor" style={{ color: CB.textSecond }}>|</span>}
            </span>
          </h1>
          <div style={{
            position: 'absolute', top: 0, left: '300px',
            borderLeft: `1px solid ${CB.border}`,
            paddingLeft: '28px', maxWidth: '190px',
            height: '100%', display: 'flex', alignItems: 'center',
          }}>
            <p style={{ fontSize: '13px', color: CB.textSecond, lineHeight: 1.75 }}>
              A notebook built for developers. Write, execute, and organize code snippets across multiple languages.
            </p>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '18px', flexShrink: 0 }}>
          {[
            {
              title: 'Instant execution',
              desc: 'Sandboxed Docker containers run your code securely.',
              svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CB.textSecond} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
            },
            {
              title: 'Organized notes',
              desc: 'Keep all your snippets structured and tagged by language.',
              svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CB.textSecond} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
            },
            {
              title: 'Private by default',
              desc: 'Your code is yours. Secured with Google OAuth and JWT.',
              svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CB.textSecond} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
            },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                background: CB.surface2, border: `1px solid ${CB.border}`,
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{f.svg}</div>
              <div>
                <div style={{ fontSize: '13px', color: CB.textPrimary, fontWeight: '500', marginBottom: '3px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: CB.textSecond, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Code preview */}
        <div style={{
          marginTop: '28px',
          background: CB.surface2,
          border: `1px solid ${CB.border}`,
          borderRadius: '8px', padding: '14px 18px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', lineHeight: 1.75, flexShrink: 0,
        }}>
          <div style={{ color: CB.textMuted, marginBottom: '4px', fontSize: '11px' }}># hello_world.py</div>
          <div><span style={{ color: '#4a9eda' }}>def </span><span style={{ color: CB.textSecond }}>greet</span><span style={{ color: CB.textMuted }}>(name):</span></div>
          <div style={{ paddingLeft: '16px' }}>
            <span style={{ color: CB.textMuted }}>return </span>
            <span style={{ color: '#4a7a4a' }}>f"Hello, </span>
            <span style={{ color: '#6a9a6a' }}>{'{'+'name}'}</span>
            <span style={{ color: '#4a7a4a' }}>!"</span>
          </div>
          <div><span style={{ color: '#4a9eda' }}>print</span><span style={{ color: CB.textMuted }}>(greet(</span><span style={{ color: '#4a7a4a' }}>"World"</span><span style={{ color: CB.textMuted }}>))</span></div>
          <div style={{
            marginTop: '8px', paddingTop: '8px',
            borderTop: `1px solid ${CB.border}`,
            color: '#4ade80', fontSize: '11px', opacity: 0.7,
          }}>▶ Hello, World!</div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', fontSize: '11px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
          © 2026 Code Notebook
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 56px', background: CB.bg,
      }}>
        <div style={{
          width: '100%', maxWidth: '320px',
          background: CB.surface,
          border: `1px solid ${CB.border2}`,
          borderRadius: '14px', padding: '32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>

          <h2 style={{ fontSize: '20px', fontWeight: '600', color: CB.textPrimary, letterSpacing: '-0.4px', marginBottom: '6px' }}>Sign in</h2>
          <p style={{ fontSize: '13px', color: CB.textSecond, marginBottom: '24px', lineHeight: 1.6 }}>
            Use your Google account to access Code Notebook.
          </p>

          {/* Google button */}
          <button className="google-btn" onClick={handleGoogleLogin} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: CB.surface2, color: CB.textPrimary,
            border: `1px solid ${CB.border2}`, borderRadius: '999px',
            padding: '11px 16px', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontFamily: 'inherit',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: CB.border }} />
            <span style={{ fontSize: '11px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: CB.border }} />
          </div>

          {/* Email coming soon */}
          <div style={{
            background: CB.surface2, border: `1px solid ${CB.border}`,
            borderRadius: '999px', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            opacity: 0.4, cursor: 'not-allowed',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CB.textSecond} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span style={{ fontSize: '12px', color: CB.textSecond, fontFamily: 'JetBrains Mono, monospace' }}>Email login — coming soon</span>
          </div>

          {/* Runtimes */}
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: `1px solid ${CB.border}` }}>
            <div style={{ fontSize: '10px', color: CB.textMuted, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>SUPPORTED RUNTIMES</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { label: 'Python 3.11', color: '#3572A5' },
                { label: 'Node 18',     color: '#c9a84c' },
                { label: 'Java 17',     color: '#b07219' },
                { label: 'GCC C++',     color: '#f34b7d' },
              ].map(lang => (
                <span key={lang.label} style={{
                  fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
                  padding: '4px 10px', borderRadius: '4px',
                  background: lang.color + '18',
                  border: `1px solid ${lang.color}35`,
                  color: lang.color,
                }}>{lang.label}</span>
              ))}
            </div>
          </div>

          {/* Terms */}
          <p style={{ marginTop: '24px', fontSize: '11px', color: CB.textMuted, lineHeight: 1.6 }}>
            By continuing you agree to our{' '}
            <span style={{ color: CB.textSecond, cursor: 'pointer', textDecoration: 'underline' }}>Terms</span>
            {' '}and{' '}
            <span style={{ color: CB.textSecond, cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
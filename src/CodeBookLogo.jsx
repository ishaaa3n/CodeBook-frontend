const CodeBookLogo = ({ size = 44 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      {/* Left curly brace */}
      <path d="M28 15 Q18 15 18 25 L18 38 Q18 45 10 50 Q18 55 18 62 L18 75 Q18 85 28 85"
        stroke="#007acc" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right curly brace */}
      <path d="M92 15 Q102 15 102 25 L102 38 Q102 45 110 50 Q102 55 102 62 L102 75 Q102 85 92 85"
        stroke="#007acc" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Left book page */}
      <path d="M60 75 Q45 60 32 50 L32 28 Q45 35 60 52 Z"
        fill="#007acc"/>
      {/* Right book page */}
      <path d="M60 75 Q75 60 88 50 L88 28 Q75 35 60 52 Z"
        fill="#007acc"/>
      {/* Book spine bottom point */}
      <path d="M54 75 Q60 82 66 75" stroke="#007acc" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
      <span style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '25px', letterSpacing: '-0.5px' }}>Code</span>
      <span style={{ color: '#007acc', fontWeight: '800', fontSize: '25px', letterSpacing: '-0.5px' }}>Book</span>
    </div>
  </div>
);

export default CodeBookLogo;
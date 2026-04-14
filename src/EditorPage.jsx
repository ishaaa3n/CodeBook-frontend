import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import API from './api';
import Editor from '@monaco-editor/react';

const LANGUAGES = ['python', 'javascript', 'java', 'cpp'];

const LANG_CONFIG = {
  python: {
    color: '#3572A5',
    glow: 'rgba(53,114,165,0.45)',
    bg: 'rgba(53,114,165,0.1)',
    border: 'rgba(53,114,165,0.4)',
    label: 'Python',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.887S0 5.789 0 11.962c0 6.172 3.413 5.953 3.413 5.953h2.038v-2.864s-.11-3.413 3.356-3.413h5.765s3.246.052 3.246-3.138V3.298S18.353 0 11.914 0zm-3.2 1.902a1.047 1.047 0 1 1 0 2.095 1.047 1.047 0 0 1 0-2.095z" fill="#3572A5"/>
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.134S24 18.211 24 12.038c0-6.172-3.413-5.953-3.413-5.953h-2.038v2.864s.11 3.413-3.356 3.413H9.428s-3.246-.052-3.246 3.138v5.202S5.647 24 12.086 24zm3.2-1.902a1.047 1.047 0 1 1 0-2.095 1.047 1.047 0 0 1 0 2.095z" fill="#FFD845"/>
      </svg>
    ),
  },
  javascript: {
    color: '#F7DF1E',
    glow: 'rgba(247,223,30,0.4)',
    bg: 'rgba(247,223,30,0.08)',
    border: 'rgba(247,223,30,0.4)',
    label: 'JS',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
        <path d="M13 19.5c0 1.6-.9 2.3-2.3 2.3-1.2 0-1.9-.6-2.3-1.4l.9-.8c.3.5.5.9 1.1.9.5 0 .9-.2.9-1V12H13v7.5z" fill="#333"/>
        <path d="M14.5 17.5c.4.6.9 1 1.7 1 .7 0 1.2-.4 1.2-.9 0-.6-.5-.8-1.3-1.1l-.4-.2c-1.2-.5-2-.9-2-2.4 0-1.2 1-2.1 2.5-2.1 1.1 0 1.9.4 2.4 1.4l-1.3.8c-.3-.5-.6-.7-1.1-.7-.5 0-.8.3-.8.7 0 .5.3.7 1.1 1l.4.2c1.5.6 2.3 1.2 2.3 2.7 0 1.5-1.2 2.3-2.8 2.3-1.6 0-2.6-.8-3.1-1.8l1.2-.9z" fill="#333"/>
      </svg>
    ),
  },
  java: {
    color: '#E76F00',
    glow: 'rgba(231,111,0,0.4)',
    bg: 'rgba(231,111,0,0.08)',
    border: 'rgba(231,111,0,0.35)',
    label: 'Java',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149zm-.561-2.55s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218z" fill="#E76F00"/>
        <path d="M13.116 14.404c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573z" fill="#E76F00"/>
        <path d="M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.749-.891 1.254-.999.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.819zM9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892zm7.824 4.373c4.503-2.34 2.421-4.588.968-4.287-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0 .001.07-.062.09-.116z" fill="#E76F00"/>
        <path d="M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.052-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627z" fill="#E76F00"/>
        <path d="M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0 0 .553.457 3.393.639z" fill="#E76F00"/>
      </svg>
    ),
  },
  cpp: {
    color: '#6295cb',
    glow: 'rgba(98,149,203,0.45)',
    bg: 'rgba(98,149,203,0.1)',
    border: 'rgba(98,149,203,0.4)',
    label: 'C++',
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2z" fill="#6295cb"/>
        <path d="M16 6.5c-2.6 0-4.94 1.02-6.67 2.67A9.44 9.44 0 0 0 6.5 16c0 2.6 1.02 4.94 2.83 6.67A9.44 9.44 0 0 0 16 25.5c2.1 0 4.04-.7 5.6-1.88l-1.5-1.5A7.44 7.44 0 0 1 16 23.5a7.5 7.5 0 1 1 4.1-13.73l1.5-1.5A9.44 9.44 0 0 0 16 6.5z" fill="#fff"/>
        <rect x="20" y="15" width="6" height="2" rx="1" fill="#fff"/>
        <rect x="22" y="13" width="2" height="6" rx="1" fill="#fff"/>
        <rect x="27" y="15" width="6" height="2" rx="1" fill="#fff"/>
        <rect x="29" y="13" width="2" height="6" rx="1" fill="#fff"/>
      </svg>
    ),
  },
};

const EditorPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('python');
  const [content, setContent] = useState('');
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [execution, setExecution] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [warning, setWarning] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const showWarning = (msg) => {
    setSuccessMsg(null);
    setWarning(msg);
    setTimeout(() => setWarning(null), 3500);
  };

  const showSuccess = (msg) => {
    setWarning(null);
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    const folderParam = searchParams.get('folder');
    if (folderParam) setSelectedFolderId(Number(folderParam));
    fetchFolders();
    if (!isNew) fetchNote();
  }, []);

  // ── Keyboard shortcuts (fixed: correct deps, not duplicated, not inside JSX) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, language, input, noteId, selectedFolderId]);

  const fetchFolders = async () => {
    try { const res = await API.get('/folders'); setFolders(res.data); } catch (e) {}
  };

  const fetchNote = async () => {
    try {
      const res = await API.get(`/notes/${id}`);
      const note = res.data;
      setTitle(note.title);
      setLanguage(note.language);
      setContent(note.content);
      setInput(note.input || '');
      setNoteId(note.id);
      setSelectedFolderId(note.folderId || null);
    } catch (e) { navigate('/notes'); }
  };

  const handleSave = async () => {
    if (!title.trim()) { showWarning('Please add a title before saving.'); return; }
    if (!content.trim()) { showWarning('Cannot save an empty note.'); return; }
    setSaving(true);
    try {
      if (isNew) {
        const res = await API.post('/notes', { title, language, content, input });
        const newNoteId = res.data.id;
        setNoteId(newNoteId);
        if (selectedFolderId) await API.post(`/notes/${newNoteId}/move`, { folderId: selectedFolderId });
        navigate(`/notes/${newNoteId}`, { replace: true });
        showSuccess('Note saved successfully!');
      } else {
        await API.put(`/notes/${id}`, { title, language, content, input });
        setNoteId(Number(id));
        showSuccess('Note saved successfully!');
      }
    } catch (e) { console.error(e); showWarning('Failed to save. Please try again.'); } finally { setSaving(false); }
  };

  const handleMoveToFolder = async (folderId) => {
    const currentNoteId = noteId || (isNew ? null : Number(id));
    setSelectedFolderId(folderId);
    setShowFolderDropdown(false);
    if (!currentNoteId) return;
    try { await API.post(`/notes/${currentNoteId}/move`, { folderId }); } catch (e) { console.error(e); }
  };

  const handleRun = async () => {
    const currentNoteId = noteId || (isNew ? null : Number(id));
    if (!currentNoteId) { showWarning('Save the note first before running.'); return; }
    setRunning(true); setExecution(null);
    try {
      const res = await API.post(`/executions/${currentNoteId}`);
      pollExecution(res.data.id);
    } catch (e) { setRunning(false); }
  };

  const pollExecution = async (execId) => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/executions/${execId}`);
        const exec = res.data;
        if (exec.status !== 'PENDING' && exec.status !== 'RUNNING') {
          setExecution(exec); setRunning(false); clearInterval(interval);
        }
      } catch (e) { setRunning(false); clearInterval(interval); }
    }, 1000);
  };

  const statusColor = (status) => {
    if (status === 'SUCCESS') return '#4ade80';
    if (status === 'FAILED') return '#f87171';
    if (status === 'TIMEOUT') return '#fb923c';
    return 'var(--text-muted)';
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const lang = LANG_CONFIG[language];

  return (
    <div style={{ height: '100vh', background: '#13151a', display: 'flex', flexDirection: 'column', color: 'rgba(220,228,240,0.9)', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --cb-blue: #1a9be6;
          --cb-blue-dim: rgba(26,155,230,0.18);
          --cb-blue-border: rgba(26,155,230,0.35);
          --cb-blue-glow: rgba(26,155,230,0.28);
          --cb-surface: #1e2128;
          --cb-surface2: #252830;
          --cb-border: rgba(255,255,255,0.07);
        }

        .run-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(26,155,230,0.5) !important; }
        .run-btn { transition: all 0.18s ease; }
        .run-btn:active { transform: translateY(0) !important; }
        .save-btn:hover { background: #2e3240 !important; border-color: rgba(160,180,210,0.25) !important; transform: translateY(-1px); }
        .save-btn:active { transform: translateY(0) !important; }
        .save-btn { transition: all 0.15s ease; }
        .folder-btn:hover { background: #2e3240 !important; border-color: rgba(26,155,230,0.35) !important; transform: translateY(-1px); }
        .folder-btn { transition: all 0.15s ease; }
        .back-btn:hover { color: #fff !important; }
        .back-btn { transition: color 0.15s ease; }
        .folder-opt:hover { background: #252830 !important; }

        .success-toast {
          position: fixed;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1a2420;
          border: 1px solid rgba(74,222,128,0.35);
          border-top: 3px solid #4ade80;
          border-radius: 0 0 10px 10px;
          padding: 11px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(74,222,128,0.08);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #86efac;
          animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
          white-space: nowrap;
        }
        .warning-toast {
          position: fixed;
          top: 64px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1e2028;
          border: 1px solid rgba(251,146,60,0.45);
          border-top: 3px solid #fb923c;
          border-radius: 0 0 10px 10px;
          padding: 11px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(251,146,60,0.1);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #fcd09a;
          animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
          white-space: nowrap;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .lang-logo-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 90px;
          height: 38px;
          border-radius: 7px;
          cursor: pointer;
          border: 1.5px solid transparent;
          background: transparent;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }
        .lang-logo-btn:hover { transform: translateY(-2px) scale(1.05); }
        .lang-logo-btn.active { transform: translateY(-1px) scale(1.03); }
        .lang-logo-btn .lang-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .lang-logo-btn:hover .lang-label { opacity: 1; }

        .stdin-panel {
          border-top: 1px solid var(--cb-border);
          background: var(--cb-surface);
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .stdin-panel:focus-within {
          border-color: var(--cb-blue-border);
          box-shadow: inset 0 1px 0 var(--cb-blue-dim);
        }
        .stdin-badge {
          position: absolute;
          top: 10px;
          left: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 2px 7px;
          border-radius: 4px;
          background: var(--cb-blue-dim);
          color: var(--cb-blue);
          border: 1px solid var(--cb-blue-border);
          pointer-events: none;
          z-index: 2;
        }
        .stdin-ta {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          resize: none;
          outline: none;
          color: rgba(200,210,225,0.8);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.7;
          padding: 34px 16px 12px;
          box-sizing: border-box;
          caret-color: var(--cb-blue);
        }
        .stdin-ta::placeholder { color: rgba(150,160,175,0.35); }

        .output-header {
          padding: 10px 18px;
          border-bottom: 1px solid var(--cb-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0,0,0,0.2);
        }
        .output-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          padding: 2px 7px;
          border-radius: 4px;
          background: var(--cb-blue-dim);
          color: var(--cb-blue);
          border: 1px solid var(--cb-blue-border);
        }
        .status-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 3px 9px;
          border-radius: 5px;
          border: 1px solid;
        }
        .output-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 2px 7px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 10px;
        }
        .stdout-label {
          background: rgba(74,222,128,0.08);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .stderr-label {
          background: rgba(248,113,113,0.08);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.2);
        }
        .output-pre {
          white-space: pre-wrap;
          word-break: break-word;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          line-height: 1.75;
          margin: 0;
          padding: 0;
        }

        /* Tooltip */
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }
        .tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #0e1016;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 5px;
          padding: 4px 9px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(180,195,215,0.8);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 9999;
        }
        .tooltip-wrapper:hover .tooltip { opacity: 1; }

        /* Pill buttons */
        .pill-btn {
          border-radius: 999px;
          padding: 0 18px;
          height: 36px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.01em;
          border: 1px solid;
          transition: all 0.15s ease;
        }
        .pill-btn-ghost {
          background: #1e2128;
          border-color: rgba(255,255,255,0.1);
          color: rgba(180,195,215,0.85);
        }
        .pill-btn-ghost:hover {
          background: #2e3240;
          border-color: rgba(160,180,210,0.25);
          transform: translateY(-1px);
        }
        .pill-btn-ghost:active { transform: translateY(0); }
        .pill-btn-primary {
          background: var(--cb-blue);
          border-color: var(--cb-blue);
          color: #fff;
          box-shadow: 0 4px 16px rgba(26,155,230,0.35);
        }
        .pill-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(26,155,230,0.5);
        }
        .pill-btn-primary:active { transform: translateY(0); }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease forwards; }
      `}</style>

      {/* Navbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#1a1c22', overflow: 'visible', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="back-btn" onClick={() => navigate('/notes')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: 0, fontFamily: 'JetBrains Mono, monospace' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Notes
          </button>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Untitled note..."
            style={{ background: 'none', border: 'none', color: 'rgba(220,228,240,0.95)', fontSize: '15px', fontWeight: '500', width: '260px', letterSpacing: '-0.2px', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Folder selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="folder-btn"
              onClick={() => setShowFolderDropdown(p => !p)}
              style={{
                background: '#1e2128',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '0 16px',
                height: '36px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(180,195,215,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.01em',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(180,195,215,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              {selectedFolder ? selectedFolder.name : 'No folder'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(180,195,215,0.5)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showFolderDropdown && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', background: '#1e2128', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', minWidth: '190px', zIndex: 50, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
                <div className="folder-opt" onClick={() => handleMoveToFolder(null)} style={{ padding: '9px 14px', fontSize: '11px', color: !selectedFolderId ? '#1a9be6' : 'rgba(160,170,185,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  No folder
                </div>
                {folders.map(f => (
                  <div key={f.id} className="folder-opt" onClick={() => handleMoveToFolder(f.id)} style={{ padding: '9px 14px', fontSize: '11px', color: selectedFolderId === f.id ? '#1a9be6' : 'rgba(160,170,185,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    {f.name}
                    <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'rgba(120,130,145,0.7)' }}>{f.noteCount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="tooltip-wrapper">
            <button className="pill-btn pill-btn-ghost" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <div className="tooltip">Ctrl + S</div>
          </div>

          {/* Run button */}
          <div className="tooltip-wrapper">
            <button className="pill-btn pill-btn-primary" onClick={handleRun} disabled={running}>
              {running ? 'Running...' : 'Run'}
            </button>
            <div className="tooltip">Ctrl + '</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} onClick={() => showFolderDropdown && setShowFolderDropdown(false)}>

        {/* LEFT — editor */}
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Language logo selector */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '10px', background: '#1a1c22', alignItems: 'center' }}>
            {LANGUAGES.map(l => {
              const cfg = LANG_CONFIG[l];
              const isActive = language === l;
              return (
                <button
                  key={l}
                  className={`lang-logo-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setLanguage(l)}
                  title={cfg.label}
                  style={{
                    background: isActive ? cfg.bg : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? `0 0 14px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
                  }}
                >
                  {cfg.icon}
                  <span
                    className="lang-label"
                    style={{ color: isActive ? cfg.color : 'rgba(130,140,155,0.7)' }}
                  >
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={content}
              onChange={(val) => setContent(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                tabSize: 4,
                automaticLayout: true,
                padding: { top: 16 },
                scrollbar: { verticalScrollbarSize: 5 },
              }}
            />
          </div>

          {/* STDIN */}
          <div className="stdin-panel" style={{ height: '120px' }}>
            <span className="stdin-badge">STDIN</span>
            <textarea
              className="stdin-ta"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter program input here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* RIGHT — output */}
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', background: '#16181e', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="output-header">
            <span className="output-badge">OUTPUT</span>
            {execution && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="status-pill"
                  style={{
                    color: statusColor(execution.status),
                    borderColor: statusColor(execution.status) + '55',
                    background: statusColor(execution.status) + '12',
                  }}
                >
                  {execution.status}
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(130,140,155,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {execution.executionTime}ms
                </span>
              </div>
            )}
          </div>

          <div style={{ flex: 1, padding: '18px', overflow: 'auto' }}>
            {!execution && !running && (
              <div style={{ color: 'rgba(130,140,155,0.5)', marginTop: '50px', textAlign: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 14px', display: 'block', opacity: 0.4 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: 0.5 }}>Run your code to see output</span>
              </div>
            )}
            {running && (
              <div style={{ color: 'rgba(130,140,155,0.6)', marginTop: '50px', textAlign: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 14px', display: 'block' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: 0.5 }}>Executing...</span>
              </div>
            )}
            {execution && (
              <div className="fade-in">
                {execution.output && (
                  <div style={{ marginBottom: execution.error ? '20px' : 0 }}>
                    <span className="output-section-label stdout-label">STDOUT</span>
                    <pre className="output-pre" style={{ color: '#4ade80' }}>{execution.output}</pre>
                  </div>
                )}
                {execution.error && (
                  <div>
                    <span className="output-section-label stderr-label">STDERR</span>
                    <pre className="output-pre" style={{ color: '#f87171' }}>{execution.error}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="success-toast">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {successMsg}
        </div>
      )}

      {/* Warning toast */}
      {warning && (
        <div className="warning-toast">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {warning}
        </div>
      )}
    </div>
  );
};

export default EditorPage;
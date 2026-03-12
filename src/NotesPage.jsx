import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import Folder from './Folder';
import CodeBookLogo from './CodeBookLogo';

const LANG_COLORS = {
  python: '#3572A5',
  javascript: '#c9a84c',
  java: '#b07219',
  cpp: '#f34b7d',
};

const FOLDER_COLORS = ['#007acc'];

// ─── CodeBook hardcoded palette (matches EditorPage) ───
const CB = {
  bg:          '#13151a',
  surface:     '#1a1c22',
  surface2:    '#1e2128',
  surface3:    '#252830',
  border:      'rgba(255,255,255,0.07)',
  border2:     'rgba(255,255,255,0.12)',
  blue:        '#1a9be6',
  blueDim:     'rgba(26,155,230,0.15)',
  blueBorder:  'rgba(26,155,230,0.3)',
  textPrimary: 'rgba(220,228,240,0.95)',
  textSecond:  'rgba(180,195,215,0.75)',
  textMuted:   'rgba(120,135,155,0.7)',
  error:       '#f47171',
  errorDim:    'rgba(244,113,113,0.12)',
  errorBorder: 'rgba(244,113,113,0.3)',
};

// ─── NoteCard ───
const NoteCard = ({ note, onClick, onDelete }) => {
  const [hovered, setHovered]       = useState(false);
  const [confirming, setConfirming] = useState(false);
  const confirmingRef               = React.useRef(false);

  const setConfirmingState = (val) => { confirmingRef.current = val; setConfirming(val); };
  const handleDeleteClick  = (e)   => { e.stopPropagation(); setConfirmingState(true); };
  const handleConfirm      = (e)   => { e.stopPropagation(); e.preventDefault(); onDelete(); };
  const handleCancel       = (e)   => { e.stopPropagation(); e.preventDefault(); setConfirmingState(false); };

  return (
    <div
      className="note-card"
      onClick={!confirmingRef.current ? onClick : (e) => e.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false); }}
      style={{
        background: CB.surface, border: `1px solid ${CB.border}`,
        borderRadius: '10px', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        position: 'relative', overflow: 'visible',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {/* Delete button */}
      {hovered && !confirming && (
        <button onClick={handleDeleteClick} style={{
          position: 'absolute', top: '-11px', right: '-11px',
          background: CB.surface3, border: `1px solid ${CB.border2}`,
          borderRadius: '50%', width: '22px', height: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: CB.textMuted, zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          transition: 'color 0.15s, background 0.15s',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      )}

      {/* Delete confirm overlay — smooth fade+scale */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', inset: 0,
          background: CB.surface,
          borderRadius: '10px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          zIndex: 3,
          border: `1px solid ${confirming ? CB.errorBorder : 'transparent'}`,
          opacity: confirming ? 1 : 0,
          transform: confirming ? 'scale(1)' : 'scale(0.96)',
          pointerEvents: confirming ? 'all' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CB.error} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
        <p style={{ fontSize: '13px', color: CB.textPrimary, fontWeight: '500', margin: 0 }}>Delete this note?</p>
        <p style={{ fontSize: '11px', color: CB.textMuted, margin: 0, textAlign: 'center', padding: '0 16px' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button className="cb-btn cb-btn-ghost" onClick={handleCancel}>Cancel</button>
          <button className="cb-btn cb-btn-danger" onClick={handleConfirm}>Delete</button>
        </div>
      </div>

      {/* Card content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '500', color: CB.textPrimary, lineHeight: 1.4, flex: 1 }}>{note.title}</h3>
        <span style={{
          fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
          padding: '3px 8px', borderRadius: '4px', flexShrink: 0,
          background: (LANG_COLORS[note.language] || '#555') + '20',
          border: `1px solid ${(LANG_COLORS[note.language] || '#555')}35`,
          color: LANG_COLORS[note.language] || CB.textSecond,
        }}>{note.language}</span>
      </div>

      {/* Code preview with fade-out gradient */}
      <div style={{
        background: CB.bg, borderRadius: '6px', padding: '10px 12px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
        color: CB.textMuted, lineHeight: 1.6,
        overflow: 'hidden', maxHeight: '60px', position: 'relative',
      }}>
        {note.content.split('\n').slice(0, 3).join('\n') || '—'}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px',
          background: `linear-gradient(to bottom, transparent, ${CB.bg})`,
          pointerEvents: 'none',
        }}/>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
          {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CB.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
};

// ─── FolderCard ───
const FolderCard = ({ folder, index, isActive, onClick, onDelete, noteCount }) => {
  const [hovered, setHovered]       = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = (e) => { e.stopPropagation(); setConfirming(true); };
  const handleConfirm     = (e) => { e.stopPropagation(); onDelete(); setConfirming(false); };
  const handleCancel      = (e) => { e.stopPropagation(); setConfirming(false); };

  return (
    <div
      className={`folder-card ${isActive ? 'active' : ''}`}
      onClick={!confirming ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false); }}
      style={{
        background: isActive ? CB.surface2 : CB.surface,
        border: `1px solid ${isActive ? CB.blue : CB.border}`,
        borderRadius: '12px', padding: '20px 24px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '12px',
        minWidth: '140px', position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s',
        boxShadow: isActive ? `0 0 0 1px ${CB.blue}22, 0 4px 20px rgba(26,155,230,0.1)` : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Delete button */}
      {hovered && !confirming && (
        <button onClick={handleDeleteClick} style={{
          position: 'absolute', top: '8px', right: '8px',
          background: CB.errorDim, border: `1px solid ${CB.errorBorder}`,
          borderRadius: '6px', width: '26px', height: '26px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: CB.error, zIndex: 2,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      )}

      {/* Delete confirm overlay — smooth fade+scale */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', inset: 0,
          background: CB.surface, borderRadius: '12px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          zIndex: 3,
          border: `1px solid ${confirming ? CB.errorBorder : 'transparent'}`,
          opacity: confirming ? 1 : 0,
          transform: confirming ? 'scale(1)' : 'scale(0.94)',
          pointerEvents: confirming ? 'all' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CB.error} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
        <p style={{ fontSize: '12px', color: CB.textPrimary, fontWeight: '500', margin: 0 }}>Delete folder?</p>
        <p style={{ fontSize: '10px', color: CB.textMuted, margin: 0, textAlign: 'center', padding: '0 8px' }}>Notes will be unfiled.</p>
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <button className="cb-btn cb-btn-ghost" onClick={handleCancel} style={{ padding: '4px 12px', fontSize: '11px' }}>Cancel</button>
          <button className="cb-btn cb-btn-danger" onClick={handleConfirm} style={{ padding: '4px 12px', fontSize: '11px' }}>Delete</button>
        </div>
      </div>

      <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Folder
          key={`folder-${folder.id}-${isActive}`}
          color={FOLDER_COLORS[index % FOLDER_COLORS.length]}
          size={0.7}
          items={Array(Math.min(noteCount, 3)).fill(null)}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: CB.textPrimary, marginBottom: '2px' }}>{folder.name}</div>
        <div style={{ fontSize: '11px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
          {folder.noteCount} note{folder.noteCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

// ─── NotesPage ───
const NotesPage = () => {
  const [notes, setNotes]               = useState([]);
  const [folders, setFolders]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [user, setUser]                 = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showNewFolder, setShowNewFolder]   = useState(false);
  const [newFolderName, setNewFolderName]   = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [userName, setUserName]             = useState('');
  const [search, setSearch]                 = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [notesRes, foldersRes] = await Promise.all([API.get('/notes'), API.get('/folders')]);
      setNotes(notesRes.data);
      setFolders(foldersRes.data);
    } catch (e) { navigate('/'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await API.post('/folders', { name: newFolderName.trim() });
      setFolders(prev => [...prev, res.data]);
      setNewFolderName(''); setShowNewFolder(false);
    } catch (e) { console.error(e); }
    finally { setCreatingFolder(false); }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await API.delete(`/folders/${folderId}`);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (selectedFolder === folderId) setSelectedFolder(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await API.delete(`/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (e) { console.error(e); }
  };

  const baseNotes = selectedFolder
    ? notes.filter(n => n.folderId === selectedFolder)
    : notes.filter(n => !n.folderId);

  const displayedNotes = search.trim()
    ? baseNotes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()) ||
        n.language.toLowerCase().includes(search.toLowerCase())
      )
    : baseNotes;

  const unfiledCount = notes.filter(n => !n.folderId).length;

  return (
    <div style={{ minHeight: '100vh', background: CB.bg, color: CB.textPrimary }}>
      <style>{`
        /* Shared button styles */
        .cb-btn {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 999px; padding: 6px 16px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          border: 1px solid transparent; transition: all 0.15s ease;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em;
        }
        .cb-btn-ghost {
          background: ${CB.surface2}; border-color: ${CB.border2};
          color: ${CB.textSecond};
        }
        .cb-btn-ghost:hover { background: #2a2d36; border-color: rgba(255,255,255,0.18); color: ${CB.textPrimary}; }
        .cb-btn-primary {
          background: linear-gradient(135deg, ${CB.blue}, #1480c8);
          color: rgba(255,255,255,0.88);
          text-shadow: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        .cb-btn-primary:hover { opacity: 0.92; box-shadow: 0 4px 14px rgba(26,155,230,0.25); transform: translateY(-1px); }
        .cb-btn-danger {
          background: ${CB.errorDim}; border-color: ${CB.errorBorder};
          color: ${CB.error};
        }
        .cb-btn-danger:hover { background: rgba(244,113,113,0.2); }

        /* Cards */
        .note-card:hover { background: ${CB.surface2} !important; border-color: rgba(255,255,255,0.11) !important; cursor: pointer; }
        .folder-card:hover { border-color: ${CB.blueBorder} !important; background: ${CB.surface2} !important; }

        /* Search input */
        .cb-search:focus { outline: none; border-color: ${CB.blueBorder} !important; box-shadow: 0 0 0 3px ${CB.blueDim}; }

        /* Tabs */
        .tab-btn { transition: all 0.15s ease; cursor: pointer; }
        .tab-btn:hover { color: ${CB.textPrimary} !important; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
        .modal { background: ${CB.surface}; border: 1px solid ${CB.border2}; border-radius: 14px; padding: 28px; width: 340px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); }
        .modal-input { width: 100%; background: ${CB.bg}; border: 1px solid ${CB.border2}; border-radius: 8px; padding: 10px 14px; color: ${CB.textPrimary}; font-size: 13px; margin: 16px 0; box-sizing: border-box; font-family: inherit; }
        .modal-input:focus { outline: none; border-color: ${CB.blue}; box-shadow: 0 0 0 3px ${CB.blueDim}; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease forwards; }
      `}</style>

      {/* Navbar */}
      <div style={{
        borderBottom: `1px solid ${CB.border}`, padding: '0 40px', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: CB.surface, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CodeBookLogo size={34} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${CB.blue}, #1480c8)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff',
              boxShadow: '0 2px 8px rgba(26,155,230,0.35)',
            }}>
              {(userName || user?.sub || '?')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', color: CB.textPrimary, fontWeight: '500' }}>
              {userName || user?.sub}
            </span>
          </div>
          <button className="cb-btn cb-btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: CB.textPrimary, letterSpacing: '-0.4px', marginBottom: '4px' }}>My Workspace</h1>
            <p style={{ fontSize: '12px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
              {folders.length} folder{folders.length !== 1 ? 's' : ''} · {notes.length} snippet{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="cb-btn cb-btn-ghost" onClick={() => setShowNewFolder(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Folder
            </button>
            <button className="cb-btn cb-btn-primary" onClick={() => navigate(selectedFolder ? `/notes/new?folder=${selectedFolder}` : '/notes/new')} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Note
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: CB.textMuted, fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
            Loading...
          </div>
        )}

        {!loading && (
          <>
            {/* Folders section */}
            {folders.length > 0 && (
              <div style={{ marginBottom: '36px' }}>
                <div style={{ fontSize: '10px', color: CB.textMuted, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: '14px' }}>FOLDERS</div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {folders.map((folder, i) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      index={i}
                      isActive={selectedFolder === folder.id}
                      onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                      onDelete={() => handleDeleteFolder(folder.id)}
                      noteCount={notes.filter(n => n.folderId === folder.id).length}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tab row + Search bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="tab-btn" onClick={() => setSelectedFolder(null)} style={{
                  background: 'none', border: 'none', padding: '0 0 8px',
                  fontSize: '13px', fontWeight: '500',
                  color: !selectedFolder ? CB.textPrimary : CB.textMuted,
                  borderBottom: !selectedFolder ? `2px solid ${CB.blue}` : '2px solid transparent',
                }}>
                  Unfiled ({unfiledCount})
                </button>
                {selectedFolder && (
                  <button className="tab-btn" style={{
                    background: 'none', border: 'none', padding: '0 0 8px',
                    fontSize: '13px', fontWeight: '500', color: CB.textPrimary,
                    borderBottom: `2px solid ${CB.blue}`,
                  }}>
                    {folders.find(f => f.id === selectedFolder)?.name} ({baseNotes.length})
                  </button>
                )}
              </div>

              {/* Search bar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CB.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="cb-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  style={{
                    background: CB.surface,
                    border: `1px solid ${CB.border2}`,
                    borderRadius: '999px',
                    padding: '7px 14px 7px 32px',
                    fontSize: '12px',
                    color: CB.textPrimary,
                    fontFamily: 'JetBrains Mono, monospace',
                    width: '210px',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: CB.textMuted, display: 'flex', alignItems: 'center', padding: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            </div>

            {/* Notes grid */}
            {displayedNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }} className="fade-in">
                <div style={{
                  width: '48px', height: '48px', background: CB.surface,
                  border: `1px solid ${CB.border}`, borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  {search
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CB.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CB.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  }
                </div>
                <p style={{ fontSize: '14px', color: CB.textSecond, marginBottom: '6px' }}>
                  {search ? `No results for "${search}"` : selectedFolder ? 'No notes in this folder' : 'No unfiled notes'}
                </p>
                <p style={{ fontSize: '12px', color: CB.textMuted }}>
                  {search ? 'Try a different keyword.' : selectedFolder ? 'Move notes here from the editor.' : 'Create a new note to get started.'}
                </p>
              </div>
            ) : (
              <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {displayedNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => navigate('/notes/' + note.id)}
                    onDelete={() => handleDeleteNote(note.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolder && (
        <div className="modal-overlay" onClick={() => setShowNewFolder(false)}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: CB.textPrimary, marginBottom: '4px' }}>New Folder</h3>
            <p style={{ fontSize: '12px', color: CB.textMuted, marginBottom: '4px' }}>Organize your notes into folders.</p>
            <input
              className="modal-input"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="cb-btn cb-btn-ghost" onClick={() => setShowNewFolder(false)}>Cancel</button>
              <button className="cb-btn cb-btn-primary" onClick={handleCreateFolder} disabled={creatingFolder}>
                {creatingFolder ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
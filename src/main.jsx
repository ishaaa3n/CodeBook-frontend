import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import NotesPage from './NotesPage.jsx';
import AuthCallback from './AuthCallback.jsx';
import EditorPage from './EditorPage.jsx';
import API from './api.js';
import './theme.css';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/notes" element={<NotesPage />} />
  <Route path="/notes/new" element={<EditorPage  />} />
  <Route path="/notes/:id" element={<EditorPage />} /> 


</Routes>

    </BrowserRouter>
)

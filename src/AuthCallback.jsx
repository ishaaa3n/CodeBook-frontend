import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
  if (handled.current) return;
  handled.current = true;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const name = params.get('name');
  if (token) {
    localStorage.setItem('token', token);
    if (name) localStorage.setItem('userName', decodeURIComponent(name));
    navigate('/notes');
  } else {
    const existing = localStorage.getItem('token');
    if (existing) navigate('/notes');
    else navigate('/');
  }
}, []);

  return null;
};

export default AuthCallback;
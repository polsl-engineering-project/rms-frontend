import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@repo/ui/src/styles/globals.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
